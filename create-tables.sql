-- =====================================================
-- CAMPAIGN MANAGEMENT APP DATABASE SETUP
-- =====================================================

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
ALTER TABLE "campaign_influencers" 
ADD CONSTRAINT "campaign_influencers_campaign_id_campaigns_id_fk" 
FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "campaign_influencers" 
ADD CONSTRAINT "campaign_influencers_influencer_id_influencers_id_fk" 
FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- =====================================================

-- Enable Row Level Security on all tables
ALTER TABLE "campaigns" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "influencers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "campaign_influencers" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES FOR CAMPAIGNS
-- =====================================================

-- Users can view their own campaigns
CREATE POLICY "Users can view their own campaigns" ON "campaigns" 
FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own campaigns
CREATE POLICY "Users can insert their own campaigns" ON "campaigns" 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own campaigns
CREATE POLICY "Users can update their own campaigns" ON "campaigns" 
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own campaigns
CREATE POLICY "Users can delete their own campaigns" ON "campaigns" 
FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES FOR INFLUENCERS
-- =====================================================

-- Anyone can view influencers (public read)
CREATE POLICY "Anyone can view influencers" ON "influencers" 
FOR SELECT USING (true);

-- Authenticated users can insert influencers
CREATE POLICY "Authenticated users can insert influencers" ON "influencers" 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update influencers
CREATE POLICY "Authenticated users can update influencers" ON "influencers" 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete influencers
CREATE POLICY "Authenticated users can delete influencers" ON "influencers" 
FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS POLICIES FOR CAMPAIGN_INFLUENCERS
-- =====================================================

-- Users can view influencers for their campaigns
CREATE POLICY "Users can view influencers for their campaigns" ON "campaign_influencers" 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaigns.id = campaign_influencers.campaign_id 
        AND campaigns.user_id = auth.uid()
    )
);

-- Users can assign influencers to their campaigns
CREATE POLICY "Users can assign influencers to their campaigns" ON "campaign_influencers" 
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaigns.id = campaign_influencers.campaign_id 
        AND campaigns.user_id = auth.uid()
    )
);

-- Users can remove influencers from their campaigns
CREATE POLICY "Users can remove influencers from their campaigns" ON "campaign_influencers" 
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaigns.id = campaign_influencers.campaign_id 
        AND campaigns.user_id = auth.uid()
    )
);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample influencers
INSERT INTO "influencers" ("name", "follower_count", "engagement_rate") VALUES
('gameguru', 120000, 3.4),
('techpix', 85000, 4.1),
('lifestyle_emre', 95000, 3.8),
('foodie_adventures', 67000, 4.5),
('travel_vibes', 110000, 3.2),
('fitness_motivation', 78000, 4.8),
('beauty_tips', 92000, 3.9),
('gaming_zone', 150000, 2.8),
('tech_reviews', 88000, 4.2),
('fashion_style', 105000, 3.6)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created successfully
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('campaigns', 'influencers', 'campaign_influencers');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('campaigns', 'influencers', 'campaign_influencers');

-- Check sample data
SELECT * FROM influencers LIMIT 5;
