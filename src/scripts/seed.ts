import { db } from "@/server/db";
import { influencers } from "@/server/db/schema";

async function main() {
  await db.insert(influencers).values([
    { name: "gameguru", followerCount: 120000, engagementRate: 3.4 as any },
    { name: "techpix", followerCount: 85000, engagementRate: 4.1 as any },
    { name: "traveljoy", followerCount: 54000, engagementRate: 5.2 as any },
  ]);
  console.log("Seed completed");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
