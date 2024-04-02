import { currentUser } from "@/lib/auth/get-server-session";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema/subscription";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe/stripe";
import { absoluteUrl } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const dashboardUrl = absoluteUrl(`/dashboard`);

export async function POST(req: Request) {
   try {
    const { priceId } = await req.json()

    const user = await currentUser()

    if (!user || !user.id || !user.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan()

    const userSubscription = await db.query.subscriptions.findFirst({
        columns: {
          stripeCurrentPeriodEnd: true,
          stripeCustomerId: true,
          stripePriceId: true,
          stripeSubscriptionId: true,
          userId: true
        },
        where: eq(subscriptions.userId, user.id)
    })

    // If The User Is Already Subscribed
    if (subscriptionPlan.isSubscribed && userSubscription?.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
         customer: userSubscription.stripeCustomerId,
         return_url: dashboardUrl
      })

      return { url: stripeSession.url }
    }

    // If The User Is Not Subscribed
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: dashboardUrl,
      cancel_url: dashboardUrl,
      customer_email: user.email,
      payment_method_types: ["card", "paypal"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          // Use price.priceIds.production In Production
          price: priceId,
          quantity: 1
        }
      ],
      metadata: {
        userId: user.id
      }
    })

    return new NextResponse(JSON.stringify({ url: stripeSession.url }))
   } catch (error) {
    console.log("STRIPE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
   }
}