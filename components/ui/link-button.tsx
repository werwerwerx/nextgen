import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface LinkButtonProps {
  href: string
  children: ReactNode
  className?: string
}

export const LinkButton = ({ href, children, className }: LinkButtonProps) => (
  <Link
    href={href}
    className={cn(
      "px-4 py-2 bg-primary text-white rounded-full flex items-center gap-2 group hover:bg-primary/80 transition-all duration-300 text-sm md:text-base",
      className
    )}
  >
    {children}
    <ArrowDown className="w-4 h-4 group-hover:scale-110 transition-all duration-300" />
  </Link>
) 