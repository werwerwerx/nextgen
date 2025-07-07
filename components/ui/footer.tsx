import { SubHeading, BodyText, SmallText } from "@/components/ui/typography";
import { SPACING } from "@/components/main-page-ui/constants";
import { LinkButton } from "@/components/ui/link-button";

import { CONENT_RESOURCES } from "@/components/main-page-ui/content-resources";
import { CourseUnion } from "@/features/cource/course.types";

export const Footer = ({ courses }: { courses: CourseUnion[] }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-card/50 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className={`flex flex-col ${SPACING.gap}`}>
            <SubHeading className="text-primary">Neural University</SubHeading>
            <BodyText className="text-sm">
              Обучение AI от практиков: задачи, стажировки, поддержка. 
              Создавайте ИИ‑решения с нуля.
            </BodyText>
          </div>

          {/* Courses Section */}
          <div className={`flex flex-col ${SPACING.gap}`}>
            <SubHeading className="text-foreground">Курсы</SubHeading>
            <div className="flex flex-col gap-2">
              <FooterLink href="/courses" text="Все курсы" />
              {courses.slice(0, 3).map((course) => (
                <FooterLink 
                  key={course.id}
                  href={`/courses/${course.id}`} 
                  text={course.title} 
                />
              ))}
              <FooterLink href="/internships" text="Стажировки" />
            </div>
          </div>

          {/* Navigation Section */}
          <div className={`flex flex-col ${SPACING.gap}`}>
            <SubHeading className="text-foreground">Навигация</SubHeading>
            <div className="flex flex-col gap-2">
              {Object.values(CONENT_RESOURCES).map(
                (link: {
                  section_id: string;
                  navTitle: string;
                  isNavigated: boolean;
                }) =>
                  link.isNavigated ? (
                    <FooterLink 
                      key={link.section_id}
                      href={`#${link.section_id}`} 
                      text={link.navTitle} 
                    />
                  ) : null
              )}
            </div>
          </div>

          {/* Company Section */}
          <div className={`flex flex-col ${SPACING.gap}`}>
            <SubHeading className="text-foreground">Компания</SubHeading>
            <div className="flex flex-col gap-2">
              <FooterLink href="/about" text="О нас" />
              <FooterLink href="/help" text="Помощь" />
            </div>
            <div className="pt-4">
              <LinkButton 
                href="#lets-start" 
                className="h-12 w-full items-center justify-center"
              >
                Начать обучение
              </LinkButton>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <SmallText className="text-muted-foreground">
            © {currentYear} Neural University. Все права защищены.
          </SmallText>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, text }: { href: string; text: string }) => (
  <a
    href={href}
    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
  >
    {text}
  </a>
);

 