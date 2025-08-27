import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProtectedNav } from "@/components/ProtectedNav";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ProtectedNav user={data.user} />
      <main className="lg:ml-64">
        {children}
      </main>
    </div>
  );
}


