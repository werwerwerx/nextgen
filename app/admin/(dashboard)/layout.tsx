import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin");
  }

  if (!user.user_metadata?.is_admin) {
    redirect("/admin?error=not_admin");
  }

  return (
    <main className="min-h-screen">
      <div className="flex-1 w-full">
        {children}
      </div>
    </main>
  );
} 