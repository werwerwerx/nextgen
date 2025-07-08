"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const isDev = process.env.NODE_ENV === 'development';

// Вспомогательная функция для отправки событий
export const trackPixelEvent = async (eventName: string, data = {}) => {
  if (isDev) {
    console.log(`[FB Pixel]: would track "${eventName}"`, data);
    return;
  }

  const { default: ReactPixel } = await import("react-facebook-pixel");
  ReactPixel.track(eventName, data);
};

function FacebookPixelContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // В режиме разработки только логируем
    if (isDev) {
      console.log("[FB Pixel]: would initialize with ID", process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
      console.log("[FB Pixel]: pageview", pathname);
      return;
    }

    // В продакшене реально инициализируем
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID as string);
        ReactPixel.pageView();
      });
  }, [pathname, searchParams]);

  return null;
}

export default function FacebookPixel() {
  if (!process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID) {
    return null;
  }

  return (
    <Suspense>
      <FacebookPixelContent />
    </Suspense>
  );
} 