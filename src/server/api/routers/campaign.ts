import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

const campaignInput = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  budget: z.number().nonnegative(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const campaignRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      console.log("Campaign list called, userId:", ctx.userId);
      
      const { data: rows, error } = await ctx.supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', ctx.userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Campaign list error:", error);
        throw error;
      }
      
      console.log("Campaign list result:", rows?.length || 0, "campaigns");
      return rows || [];
    } catch (error) {
      console.error("Campaign list error:", error);
      throw error;
    }
  }),

  byId: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    try {
      console.log("Campaign byId called, id:", input.id, "userId:", ctx.userId);
      
      const { data: rows, error } = await ctx.supabase
        .from('campaigns')
        .select('*')
        .eq('id', input.id)
        .eq('user_id', ctx.userId)
        .limit(1);
      
      if (error) {
        console.error("Campaign byId error:", error);
        throw error;
      }
      
      if (!rows || rows.length === 0) {
        console.log("Campaign not found");
        throw new Error("NOT_FOUND");
      }
      
      console.log("Campaign found:", rows[0].title);
      return rows[0];
    } catch (error) {
      console.error("Campaign byId error:", error);
      throw error;
    }
  }),

  create: protectedProcedure.input(campaignInput).mutation(async ({ ctx, input }) => {
    try {
      console.log("Campaign create called, userId:", ctx.userId);
      
      if (input.startDate > input.endDate) throw new Error("INVALID_DATE_RANGE");
      
      const { data: inserted, error } = await ctx.supabase
        .from('campaigns')
        .insert({
          user_id: ctx.userId,
          title: input.title,
          description: input.description,
          budget: input.budget,
          start_date: input.startDate.toISOString().split('T')[0],
          end_date: input.endDate.toISOString().split('T')[0],
        })
        .select()
        .single();
      
      if (error) {
        console.error("Campaign create error:", error);
        throw error;
      }
      
      console.log("Campaign created:", inserted.title);
      return inserted;
    } catch (error) {
      console.error("Campaign create error:", error);
      throw error;
    }
  }),

  update: protectedProcedure
    .input(campaignInput.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("Campaign update called, id:", input.id, "userId:", ctx.userId);
        
        if (input.startDate > input.endDate) throw new Error("INVALID_DATE_RANGE");
        
        const { data: updated, error } = await ctx.supabase
          .from('campaigns')
          .update({
            title: input.title,
            description: input.description,
            budget: input.budget,
            start_date: input.startDate.toISOString().split('T')[0],
            end_date: input.endDate.toISOString().split('T')[0],
          })
          .eq('id', input.id)
          .eq('user_id', ctx.userId)
          .select()
          .single();
        
        if (error) {
          console.error("Campaign update error:", error);
          throw error;
        }
        
        if (!updated) {
          console.log("Campaign not found for update");
          throw new Error("NOT_FOUND");
        }
        
        console.log("Campaign updated:", updated.title);
        return updated;
      } catch (error) {
        console.error("Campaign update error:", error);
        throw error;
      }
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      console.log("Campaign delete called, id:", input.id, "userId:", ctx.userId);
      
      // Delete campaign_influencers first
      await ctx.supabase
        .from('campaign_influencers')
        .delete()
        .eq('campaign_id', input.id);
      
      // Delete campaign
      const { data: deleted, error } = await ctx.supabase
        .from('campaigns')
        .delete()
        .eq('id', input.id)
        .eq('user_id', ctx.userId)
        .select()
        .single();
      
      if (error) {
        console.error("Campaign delete error:", error);
        throw error;
      }
      
      if (!deleted) {
        console.log("Campaign not found for delete");
        throw new Error("NOT_FOUND");
      }
      
      console.log("Campaign deleted:", deleted.title);
      return deleted;
    } catch (error) {
      console.error("Campaign delete error:", error);
      throw error;
    }
  }),

  assignInfluencer: protectedProcedure
    .input(z.object({ campaignId: z.number(), influencerId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("Assign influencer called, campaignId:", input.campaignId, "userId:", ctx.userId);
        
        // Check if campaign belongs to user
        const { data: owner, error: ownerError } = await ctx.supabase
          .from('campaigns')
          .select('id')
          .eq('id', input.campaignId)
          .eq('user_id', ctx.userId)
          .limit(1);
        
        if (ownerError) {
          console.error("Owner check error:", ownerError);
          throw ownerError;
        }
        
        if (!owner || owner.length === 0) {
          console.log("Campaign not owned by user");
          throw new Error("FORBIDDEN");
        }
        
        // Assign influencer
        const { error: assignError } = await ctx.supabase
          .from('campaign_influencers')
          .upsert({
            campaign_id: input.campaignId,
            influencer_id: input.influencerId,
          });
        
        if (assignError) {
          console.error("Assign influencer error:", assignError);
          throw assignError;
        }
        
        console.log("Influencer assigned successfully");
        return { success: true };
      } catch (error) {
        console.error("Assign influencer error:", error);
        throw error;
      }
    }),

  influencers: protectedProcedure
    .input(z.object({ campaignId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        console.log("Campaign influencers called, campaignId:", input.campaignId, "userId:", ctx.userId);
        
        const { data: rows, error } = await ctx.supabase
          .from('campaign_influencers')
          .select(`
            influencer_id,
            influencers (
              id,
              name,
              follower_count,
              engagement_rate
            )
          `)
          .eq('campaign_id', input.campaignId);
        
        if (error) {
          console.error("Campaign influencers error:", error);
          throw error;
        }
        
        const filteredRows = rows?.map(row => row.influencers).filter(Boolean) || [];
        console.log("Campaign influencers result:", filteredRows.length, "influencers");
        return filteredRows;
      } catch (error) {
        console.error("Campaign influencers error:", error);
        throw error;
      }
    }),
});
