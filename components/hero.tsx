import { LeadRequestFormFeature } from "@/features/lead/lead-request/lead-request-form.feature";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Hero() {
  return (
    <div className="w-screen min-h-screen flex flex-col items-start justify-center px-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto flex flex-col items-start justify-center relative">
        {/* AI Badge - positioned in top right within container */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute top-6 right-0 hidden sm:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-full border border-blue-200 dark:border-blue-800 transition-all hover:scale-105">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  UI сгенерирован AI
                </span>
              </div>
            </TooltipTrigger>
                         <TooltipContent className="bg-card text-sm text-muted-foreground p-5">
               <p>
                 Этот интерфейс создан с помощью ИИ-ассистента<br />
                 просто чтобы было что показать пока что, как это может выглядеть.
               </p>
             </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Content */}

        <div className="space-y-8 text-center lg:text-left">
          {/* УТП */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Первый в России{" "}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Нейро-Университет
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Персональное обучение программированию с ИИ-ментором
            </p>
          </div>

          {/* Ключевые преимущества */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-lg">
                Адаптивная программа под ваш уровень
              </span>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-lg">Реальные проекты от IT-компаний</span>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-lg">Гарантированное трудоустройство</span>
            </div>
          </div>

          {/* Социальные доказательства */}
          <div className="grid grid-cols-3 gap-6 py-6 border-y border-border">
            <div className="text-center">
              <div className="text-2xl font-bold">2000+</div>
              <div className="text-sm text-muted-foreground">Выпускников</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm text-muted-foreground">
                Трудоустройство
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4.9</div>
              <div className="text-sm text-muted-foreground">Рейтинг курса</div>
            </div>
          </div>

          {/* Testimonial */}
          <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
            &ldquo;За 4 месяца стал middle React-разработчиком. ИИ-ментор помог
            разобраться с самыми сложными концепциями&rdquo;
            <footer className="mt-2 font-semibold text-foreground">
              — Алексей М., Frontend Developer
            </footer>
          </blockquote>
        </div>

        {/* Right side - Form */}
        <div className="flex justify-center">
          <LeadRequestFormFeature />
        </div>
      </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
    </div>
  );
}
