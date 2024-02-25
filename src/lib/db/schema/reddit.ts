import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";
import { keywords } from "./keyword";

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

export type RedditCampaignType = typeof redditCampaigns.$inferInsert