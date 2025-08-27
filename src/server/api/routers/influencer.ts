import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const influencerRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    try {
      console.log("Influencer list called");
      
      if (!ctx.supabase) {
        throw new Error("Supabase client not available");
      }
      
      const { data: rows, error } = await ctx.supabase
        .from('influencers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Influencer list error:", error);
        throw error;
      }
      
      console.log("Influencer list result:", rows?.length || 0, "influencers");
      return rows || [];
    } catch (error) {
      console.error("Influencer list error:", error);
      throw error;
    }
  }),

  // Optional basic create for convenience
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        followerCount: z.number().int().nonnegative(),
        engagementRate: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("Influencer create called:", input.name);
        
        if (!ctx.supabase) {
          throw new Error("Supabase client not available");
        }
        
        const { data: inserted, error } = await ctx.supabase
          .from('influencers')
          .insert({
            name: input.name,
            follower_count: input.followerCount,
            engagement_rate: input.engagementRate,
          })
          .select()
          .single();
        
        if (error) {
          console.error("Influencer create error:", error);
          throw error;
        }
        
        console.log("Influencer created:", inserted.name);
        return inserted;
      } catch (error) {
        console.error("Influencer create error:", error);
        throw error;
      }
    }),
});
