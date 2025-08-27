-- Create campaigns table
CREATE TABLE IF NOT EXISTS "campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"budget" numeric(12, 2) DEFAULT '0' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Create influencers table
CREATE TABLE IF NOT EXISTS "influencers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"follower_count" integer DEFAULT 0 NOT NULL,
	"engagement_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Create campaign_influencers junction table
CREATE TABLE IF NOT EXISTS "campaign_influencers" (
	"campaign_id" integer NOT NULL,
	"influencer_id" integer NOT NULL,
	CONSTRAINT "campaign_influencers_campaign_id_influencer_id_pk" PRIMARY KEY("campaign_id","influencer_id")
);

-- Add foreign key constraints
ALTER TABLE "campaign_influencers" ADD CONSTRAINT "campaign_influencers_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "campaign_influencers" ADD CONSTRAINT "campaign_influencers_influencer_id_influencers_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Enable Row Level Security
ALTER TABLE "campaigns" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "influencers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "campaign_influencers" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for campaigns
CREATE POLICY "Users can view their own campaigns" ON "campaigns" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own campaigns" ON "campaigns" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own campaigns" ON "campaigns" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own campaigns" ON "campaigns" FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for influencers (public read, authenticated insert)
CREATE POLICY "Anyone can view influencers" ON "influencers" FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert influencers" ON "influencers" FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for campaign_influencers
CREATE POLICY "Users can view influencers for their campaigns" ON "campaign_influencers" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM campaigns 
    WHERE campaigns.id = campaign_influencers.campaign_id 
    AND campaigns.user_id = auth.uid()
  )
);
CREATE POLICY "Users can assign influencers to their campaigns" ON "campaign_influencers" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM campaigns 
    WHERE campaigns.id = campaign_influencers.campaign_id 
    AND campaigns.user_id = auth.uid()
  )
);
