import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const MainHeading = ({
  children,
  className,
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    className={cn(
      "text-4xl md:text-4xl lg:text-5xl font-bold text-foreground drop-shadow-sm",
      className
    )}
    {...props}
    style={withShadowForegroundStyle}
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
      "text-5xl md:text-5xl lg:text-7xl font-bold text-foreground drop-shadow-sm",
      withGradientCn,
      className
    )}
    {...props}
    style={withShadowPrimaryStyle}
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
      "text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground drop-shadow-lg py-2",
      className
    )}
    {...props}
    style={withShadowForegroundStyle}
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
      "text-4xl md:text-4xl lg:text-5xl font-semibold leading-tight text-center drop-shadow-lg py-2",
      withGradientCn,
      className
    )}
    {...props}
      style={withShadowPrimaryStyle}
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
    className={cn("text-md md:text-xl/6 font-semibold text-muted-foreground leading-tight whitespace-pre-line", className)}
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
  <p className={cn("text-base font-semibold text-foreground/70", className)} {...props}>
    {children}
  </p>
);

export const SmallText = ({
  children,
  className,
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLElement>) => (
  <small
    className={cn("text-xs font-semibold text-muted-foreground/70", className)}
    {...props}
  >
    {children}
  </small>
);

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

interface GradientSectionHeadingProps {
  text: string;
  className?: string;
}

const withShadowPrimaryStyle = {filter: "drop-shadow(0 19px 10px hsl(var(--primary) / 0.3))"}
const withShadowForegroundStyle = {filter: "drop-shadow(0 19px 10px hsl(var(--foreground) / 0.3))"}


const withGradientCn = "bg-gradient-to-r from-primary via-primary-500 to-purple-500 bg-clip-text text-transparent "