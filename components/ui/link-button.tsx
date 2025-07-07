import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LinkButtonProps {
  href?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  target?: string;
  rel?: string;
}

export const LinkButton = ({
  href = "/courses",
  children,
  className,
  icon = (
    <ArrowDown className="w-4 h-4 text-foreground group-hover:scale-110 transition-all duration-300" />
  ),
  target,
  rel,
  ...props
}: LinkButtonProps & React.HTMLAttributes<HTMLAnchorElement>) => (
  <Link
    href={href}
    className={cn(
      "px-5 py-2 bg-primary text-primary-foreground font-semibold shadow-primary/70 shadow-2xl rounded-full flex items-center gap-2 group hover:bg-primary/80 transition-all duration-300 text-sm md:text-base",
      className
    )}
    target={target}
    rel={rel}
    {...props}
  >
    {children}
    <div className="w-8 flex items-center justify-center h-8 bg-card rounded-full group-hover:scale-110 transition-all duration-300">
      {icon}
    </div>
  </Link>
);
