"use client";
import { CARDS, SPACING } from "@/components/main-page-ui/constants";
import {
  BodyText,
  MainHeading,
} from "@/components/ui/typography";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

export const BaseCourceCardContainer = ({
  courseId,
  classname,
  children,
  ...props
}: {
  courseId: number;
  classname?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/courses/${courseId}`);
  };

  return (
    <div
      className={cn(
        `${CARDS.base} ${CARDS.hover} ${SPACING.gapSemantic} bg-card shadow-md rounded-xl p-5 md:p-10 w-full text-foreground h-full flex flex-col justify-between hover:bg-primary group transition-all duration-300 cursor-pointer`,
        classname
      )}
      {...props}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export const CourceCardBadge = ({
  children,
  classname,
  variant = "primary",
  ...props
}: {
  children: React.ReactNode;
  classname?: string;
  variant?: "primary" | "secondary" | "outline";
} & React.HTMLAttributes<HTMLDivElement>) => {
  const mapVariant = {
    primary: "bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary-foreground/10 group-hover:text-primary-foreground group-hover:border-primary-foreground/20",
    secondary: "bg-card text-secondary border-2 border-secondary font-semibold shadow-sm group-hover:bg-secondary-foreground group-hover:text-secondary group-hover:border-secondary group-hover:shadow-secondary/20",
    outline: "bg-background/80 backdrop-blur-sm border border-border text-foreground group-hover:bg-primary-foreground/10 group-hover:text-primary-foreground group-hover:border-primary-foreground/20"
  };

  return (
    <div
      className={cn(
        "py-1 px-3 text-xs !font-semibold rounded-lg",
        "transition-all duration-300 ease-in-out",
        "flex items-center justify-center",
        "backdrop-blur-[2px]",
        mapVariant[variant],
        classname
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CourceCardTitle = ({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <MainHeading
      className="text-start font-medium !text-2xl group-hover:!text-primary-foreground transition-all duration-300 line-clamp-3 md:line-clamp-2"
      {...props}
    >
      {children}
    </MainHeading>
  );
};

export const CourceCardArrow = () => {
  return (
    <ArrowUpRight className="w-8 h-8 text-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-primary-foreground" />
  );
};

export const CourseCardPrice = ({ value }: { value: string }) => (
  <MainHeading className="text-start !font-medium !text-2xl text group-hover:!text-primary-foreground transition-all duration-300">
    {value}
  </MainHeading>
);

export const CourceCardDecription = ({ description }: { description: string }) => (
  <BodyText className="text-start group-hover:!text-primary-foreground/80 transition-all duration-300 line-clamp-3">
    {description}
  </BodyText>
);
