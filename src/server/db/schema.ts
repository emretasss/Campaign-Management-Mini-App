import { pgTable, serial, uuid, varchar, text, integer, numeric, date, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  budget: numeric("budget", { precision: 12, scale: 2 }).notNull().default("0"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const influencers = pgTable("influencers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  followerCount: integer("follower_count").notNull().default(0),
  engagementRate: numeric("engagement_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const campaignInfluencers = pgTable(
  "campaign_influencers",
  {
    campaignId: integer("campaign_id").notNull(),
    influencerId: integer("influencer_id").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.campaignId, t.influencerId] }),
  })
);
