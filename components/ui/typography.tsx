import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

interface GradientSectionHeadingProps {
  text: string;
  className?: string;
}

const withGradientCn = "bg-gradient-to-r from-primary via-primary-500 to-purple-500 bg-clip-text text-transparent "
export const MainHeading = ({
  children,
  className,
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    className={cn(
      "text-2xl md:text-4xl lg:text-5xl font-bold text-foreground drop-shadow-sm",
      className
    )}
    {...props}
    style={{ textShadow: "0 0 50px rgba(0, 0, 0, 0.23)" }}
  >
    {children}
  </h1>
);
export const GradientLargeHeading = ({
  children,
  className,
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    className={cn(
      "text-4xl md:text-5xl lg:text-7xl font-bold text-foreground drop-shadow-sm",
      withGradientCn,
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
      "text-2xl md:text-4xl lg:text-5xl font-semibold text-foreground drop-shadow-lg",
      className
    )}
    {...props}
    style={{ textShadow: "0 0 50px rgba(0, 0, 0, 0.23)" }}
  >
    {children}
  </h2>
);
export const GradientSectionHeading = ({
  text,
  className,
  ...props
}: GradientSectionHeadingProps & React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn(
      "text-2xl md:text-4xl lg:text-5xl font-semibold leading-tight text-center drop-shadow-lg",
      withGradientCn,
      className
    )}
    {...props}
    style={{ 
      filter: "drop-shadow(0 4px 12px rgba(139, 69, 19, 0.15)) drop-shadow(0 2px 6px rgba(168, 85, 247, 0.1))"
    }}
  >
    {text}
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
    className={cn("text-sm md:text-md font-semibold text-muted-foreground leading-tight whitespace-pre-line", className)}
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
