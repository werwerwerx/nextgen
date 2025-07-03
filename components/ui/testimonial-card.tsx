import { Card, CardContent } from "@/components/ui/card";
import { BodyText, GradientLargeHeading, MainHeading, SmallText, SubHeading, Subtitle } from "@/components/ui/typography";
import { CARDS, SPACING } from "@/components/main-page-ui/constants";
import { LinkButton } from "@/components/ui/link-button";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";

interface TestimonialCardProps {
  testimonial: {
    text?: string;
    claim?: string;
    author: string;
    source: string;
    date?: string;
    avatar_img?: string | null;
  };
}

function TestimonialAvatar({
  author,
  avatar_img,
}: {
  author: string;
  avatar_img?: string | null;
}) {
  return (
    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-accent/30 overflow-hidden">
      {avatar_img ? (
        <Image
          src={`/${avatar_img}`}
          alt={author}
          width={80}
          height={80}
          className="object-cover w-20 h-20"
        />
      ) : (
        <div className="flex items-center justify-center w-20 h-20 bg-muted text-muted-foreground text-3xl font-bold select-none">
          {author[0]}
        </div>
      )}
    </div>
  );
}

function TestimonialStars() {
  return (
    <div className="flex flex-row gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

function TestimonialText({ text, claim }: { text?: string; claim?: string }) {
  return (
    <BodyText className="italic leading-relaxed text-center line-clamp-2 md:line-clamp-none text-start">
      &ldquo;{text || claim}&rdquo;
    </BodyText>
  );
}


function TestimonialAuthor({ author }: { author: string }) {
  return <MainHeading >{author}</MainHeading>;
}


const SeeMore = ({children, href, ...props}: {children: React.ReactNode, href: string} & React.HTMLAttributes<HTMLAnchorElement>) => {
  return (
     <Link href={href} target="_blank" rel="noopener noreferrer" {...props} className="text-primary flex flex-row items-center gap-2">
      {children}
      <ArrowRight className="w-6 h-6  group-hover:scale-110 transition-all duration-300" />
    </Link>
  )
}

export const TestimonialCard = ({ testimonial, className }: TestimonialCardProps & {className?: string}) => (
  <Card className={`!bg-background !border-none !shadow-none `}>

    <CardContent className={`${CARDS.content} ${className}`}>
      <div className={`flex flex-col items-center ${SPACING.gap}`}>
        <div className="flex flex-col items-start gap-4 w-full">
          <div className={`${SPACING.gap} flex flex-row items-center`}>
          <TestimonialAvatar
            author={testimonial.author}
            avatar_img={testimonial.avatar_img}
          />
          <TestimonialAuthor author={testimonial.author} />

          </div>
          <TestimonialStars />
        </div>
        <TestimonialText text={testimonial.text} claim={testimonial.claim}  />
        <SeeMore href={testimonial.source}>
          <Subtitle className="!text-primary !text-sm">
          Перейти к отзыву
          </Subtitle>
        </SeeMore>
      </div>
    </CardContent>
  </Card>
);
