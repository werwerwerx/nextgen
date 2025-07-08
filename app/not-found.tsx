"use client";

import { PageContainer } from "@/components/continer";
import { SectionHeading, Subtitle } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function NotFoundContent() {
  const router = useRouter();

  return (
    <PageContainer className="min-h-[80vh] md:min-h-[90vh] justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-8 w-full max-w-md text-center">
        <div className="space-y-4">
          <SectionHeading>
            Страница не найдена
          </SectionHeading>
          <Subtitle>
            К сожалению, запрашиваемая страница не существует или была удалена
          </Subtitle>
        </div>
        
        <Button 
          onClick={() => router.push("/")}
          className="w-full h-12 rounded-xl"
        >
          Вернуться на главную
        </Button>
      </div>
    </PageContainer>
  );
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
} 