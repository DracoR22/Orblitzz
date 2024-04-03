import SubscriptionReceiptEmail from "@/emails/subscription-receipt-email";
import { currentUser } from "@/lib/auth/get-server-session";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema/subscription";
import { sendSubscriptionReceiptEmail } from "@/lib/send-emails/resend";
import { stripe } from "@/lib/stripe/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  
export async function OPTIONS(req: Request) {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    // const user = await currentUser()

    // if (!user || !user.email) {
    //   return new NextResponse ("Unauthorized", { status: 401 });
    // }

    // const dbUser = await db.query.users.findFirst({
    //   columns: {
    //     name: true,
    //     email: true
    //   }
    // })
  
    let event: Stripe.Event;
  
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      )
    } catch (error) {
      return new NextResponse ("Webhook error", { status: 400 });
    }
  
    const session = event.data.object as Stripe.Checkout.Session;
  
    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
  
      if (!session?.metadata?.userId) {
        return new NextResponse("User ID is required", { status: 400 });
      }
  
     await db.insert(subscriptions).values({
        userId: session?.metadata?.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
     })
    }
  
    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
  
      await db.update(subscriptions).set({
        stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          )
        
      }).where(
        eq(subscriptions.stripeSubscriptionId, subscription.id,)
      )

      await sendSubscriptionReceiptEmail({ userEmail: session.customer_email || '', price: session.amount_total!})

    
    }
  
    return new NextResponse(null, { status: 200, headers: corsHeaders }, );
  };
