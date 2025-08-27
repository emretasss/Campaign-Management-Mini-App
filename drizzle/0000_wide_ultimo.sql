CREATE TABLE "campaign_influencers" (
	"campaign_id" integer NOT NULL,
	"influencer_id" integer NOT NULL,
	CONSTRAINT "campaign_influencers_campaign_id_influencer_id_pk" PRIMARY KEY("campaign_id","influencer_id")
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"budget" numeric(12, 2) DEFAULT '0' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "influencers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"follower_count" integer DEFAULT 0 NOT NULL,
	"engagement_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
