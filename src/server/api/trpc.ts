import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";


export async function createTRPCContext() {
  try {
    console.log("Creating tRPC context...");
    
    const supabase = await createSupabaseServerClient();
    console.log("Supabase client created");
    
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    
    console.log("Auth result:", { user: user?.email, error: error?.message });
    
    if (error) {
      console.error("Supabase auth error:", error);
      return { supabase, user: null };
    }
    
    console.log("tRPC context created successfully");
    return { supabase, user };
  } catch (error) {
    console.error("Error creating tRPC context:", error);
    return { supabase: null, user: null };
  }
}

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  console.log("Protected procedure called, user:", ctx.user?.email);
  
  if (!ctx.user) {
    console.error("UNAUTHORIZED: No user in context");
    throw new Error("UNAUTHORIZED");
  }
  
  console.log("User authorized:", ctx.user.email);
  return next({ 
    ctx: { 
      ...ctx, 
      userId: ctx.user.id 
    } as typeof ctx & { userId: string } 
  });
});
