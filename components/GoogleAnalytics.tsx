"use client";

import { GoogleAnalytics as GA } from "@next/third-parties/google";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";

const isDev = process.env.NODE_ENV === "development";

function GoogleAnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isDev) {
      console.log("[GA4]: would track pageview", {
        page_path: pathname,
        page_search: searchParams.toString(),
      });
      return;
    }
  }, [pathname, searchParams]);

  if (!process.env.NEXT_PUBLIC_GA4_ID) {
    console.warn("[GA4]: Missing measurement ID");
    return null;
  }

  return <GA gaId={process.env.NEXT_PUBLIC_GA4_ID} />;
}

export default function GoogleAnalytics() {
  return (
    <Suspense>
      <GoogleAnalyticsContent />
    </Suspense>
  );
} 