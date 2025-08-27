import { router } from "./trpc";
import { campaignRouter } from "./routers/campaign";

import { influencerRouter } from "./routers/influencer";

export const appRouter = router({
  campaign: campaignRouter,
  influencer: influencerRouter,
});

export type AppRouter = typeof appRouter;


