import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { LAYOUT, SPACING } from "./main-page-ui/constants";

export const PageContainer = ({children, className, ...props}: {children: React.ReactNode, className?: string} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <main className="min-h-screen bg-background">
      <div className={cn(className, `${LAYOUT.container} my-16 sm:my-10 md:my-16 lg:my-20 px-4 md:px-2  flex flex-col items-center justify-center text-center ${SPACING.gapSection}`)} {...props}>
        {children}
      </div>
    </main>
  )
}