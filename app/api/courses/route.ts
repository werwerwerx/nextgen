import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const client = await createClient();
  const { data: courses, error } = await client.from("cources").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(courses);
}