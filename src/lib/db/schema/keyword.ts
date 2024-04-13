import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { redditCampaigns } from "./reddit";

export const keywords = pgTable("keyword", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    content: text('content').notNull(),
    order: integer('order').notNull(),
    columnId: text('columnId').notNull(),

    createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),

    redditCampaignId: uuid("redditCampaignId").notNull().references(() => redditCampaigns.id, { onDelete: 'cascade' })
})

export type KeywordType = typeof keywords.$inferInsert