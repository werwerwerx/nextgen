import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export const MainHeading = ({
  children,
  className,
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    className={cn(
      "text-2xl md:text-4xl lg:text-5xl font-semibold text-foreground drop-shadow-sm",
      className
    )}
    {...props}
    style={{ textShadow: "0 0 50px rgba(0, 0, 0, 0.23)" }}
  >
    {children}
  </h1>
);

export const SectionHeading = ({
  children,
  className,
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn(
      "text-xl md:text-3xl lg:text-4xl font-bold text-foreground drop-shadow-sm",
      className
    )}
    {...props}
    style={{ textShadow: "0 0 20px rgba(0, 0, 0, 0.25)" }}
  >
    {children}
  </h2>
);

export const SubHeading = ({
  children,
  className,
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-lg md:text-xl font-semibold text-foreground",
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

export const Subtitle = ({
  children,
  className,
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-lg md:text-md text-muted-foreground leading-tight whitespace-pre-line", className)}
    {...props}
  >
    {children}
  </p>
);

export const BodyText = ({
  children,
  className,
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-base text-foreground", className)} {...props}>
    {children}
  </p>
);

export const SmallText = ({
  children,
  className,
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLElement>) => (
  <small
    className={cn("text-xs text-muted-foreground/70", className)}
    {...props}
  >
    {children}
  </small>
);
