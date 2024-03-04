import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user";

export const redditCampaigns = pgTable("redditCampaign", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    image: text("image"),
    title: text("title").notNull(),
    description: text("description").notNull(),
    autoReply: boolean('autoReply'),
    tone: text("tone").notNull(),
    url: text("url").notNull(),

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

    createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),

    projectId: uuid("projectId").notNull().references(() => redditCampaigns.id, { onDelete: "cascade" })
})

export type RedditReplyType = typeof redditReplies.$inferInsert
export type RedditCampaignType = typeof redditCampaigns.$inferInsert