import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user";

export const subscriptions =  pgTable("subscription", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripePriceId: text("stripe_price_id"),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end", { withTimezone: true }),

    userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
})