import { NextRequest, NextResponse } from "next/server";

const getPartnerLink = (interest: string | null | undefined): string => {
  const baseUrl = "https://neural-university.ru/sales-0624";
  const utm = new URLSearchParams({
    utm_source: "nextgen",
    utm_campaign: "lead",
    utm_content: interest || "general",
  });
  return `${baseUrl}?${utm.toString()}`;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const interest = searchParams.get('interest');
  
  const redirectUrl = getPartnerLink(interest);
  
  console.log('🔄 Redirecting to:', redirectUrl);
  
  return NextResponse.redirect(redirectUrl, { status: 302 });
} 