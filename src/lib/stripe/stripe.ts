import Stripe from 'stripe'
import { currentUser } from '../auth/get-server-session'
import { PLANS } from './plans'
import { db } from '../db'
import { eq } from 'drizzle-orm'
import { subscriptions } from '../db/schema/subscription'
import { getMonthlyReplies } from '@/server/actions/reddit-actions'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2023-10-16',
    typescript: true,
})

export async function getUserSubscriptionPlan() {
    const user = await currentUser()

    if (!user || !user.id) {
        return {
            ...PLANS[0],
            isSubscribed: false,
            isCanceled: false,
            stripeCurrentPeriodEnd: null
        }
    }

    const userPlan = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, user.id)
    })

    if (!userPlan) {
        return {
            ...PLANS[0],
            isSubscribed: false,
            isCanceled: false,
            stripeCurrentPeriodEnd: null
        }
    }

    const isSubscribed = Boolean(
        userPlan.stripePriceId && userPlan.stripeCurrentPeriodEnd && userPlan.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
    )

    const plan = isSubscribed ? PLANS.find((plan) => plan.price.priceIds.production === userPlan.stripePriceId) : null

    let isCanceled = false

    if (isSubscribed && userPlan.stripeSubscriptionId) {
        const stripePlan = await stripe.subscriptions.retrieve(userPlan.stripeSubscriptionId)

        isCanceled = stripePlan.cancel_at_period_end
    }

    return {
        ...plan,
        stripeSubscriptionId: userPlan.stripeSubscriptionId,
        stripeCurrentPeriodEnd: userPlan.stripeCurrentPeriodEnd,
        stripeCustomerId: userPlan.stripeCustomerId,
        isSubscribed,
        isCanceled
    }
}