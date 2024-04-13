import { timestamp, pgTable, text, primaryKey, integer, uuid, boolean } from "drizzle-orm/pg-core"
  import type { AdapterAccount } from '@auth/core/adapters'

  
  export const users = pgTable("user", {
   id: uuid("id").defaultRandom().notNull().primaryKey(),
   name: text("name"),
   email: text("email").notNull(),
   emailVerified: timestamp("emailVerified", { mode: "date" }),
   image: text("image"),
   role: text('user')
  })
  
  export const accounts = pgTable("account", {
    userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
   (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  })
  )
  
  export const sessions = pgTable("session", {
   sessionToken: text("sessionToken").notNull().primaryKey(),
   userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
   expires: timestamp("expires", { mode: "date" }).notNull(),
  })
  
  export const verificationTokens = pgTable("verificationToken", {
     identifier: text("identifier").notNull(),
     token: text("token").notNull(),
     expires: timestamp("expires", { mode: "date" }).notNull(),
   },
   (vt) => ({
     compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
   })
  )

  export const keywords = pgTable("keyword", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    content: text('content').notNull(),
    order: integer('order').notNull(),
    columnId: text('columnId').notNull(),

    createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),

    redditCampaignId: uuid("redditCampaignId").notNull().references(() => redditCampaigns.id, { onDelete: 'cascade' })
})

export const redditCampaigns = pgTable("redditCampaign", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    image: text("image"),
    title: text("title").notNull(),
    description: text("description").notNull(),
    autoReply: boolean('autoReply'),
    tone: text("tone").notNull(),
    url: text("url").notNull(),
    autoReplyLimit: integer('autoReplyLimit').notNull().default(0),

    createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    
    userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
})

export const redditReplies = pgTable("redditReplies", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  postId: text("postId"),
  title: text("content"),
  postAuthor: text("postAuthor"),
  reply: text("reply"),
  postUrl: text("postUrl"),
  accountClientId: text("accountClientId"),

  createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),

  projectId: uuid("projectId").notNull().references(() => redditCampaigns.id, { onDelete: "cascade" })
})

export const subscriptions =  pgTable("subscription", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end", { withTimezone: true }),

  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
})