import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminCheckResponse } from "../types";

export async function GET(): Promise<NextResponse<AdminCheckResponse>> {
  try {
    const supabase = createAdminClient();
    
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    
    const hasAdmin = existingUsers.users.some(user => 
      user.user_metadata?.is_admin
    );
    
    return NextResponse.json({
      success: true,
      hasAdmin,
    });
    
  } catch (error) {
    console.error("Check admin error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Ошибка сервера",
        hasAdmin: false 
      },
      { status: 500 }
    );
  }
} 