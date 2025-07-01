import { ThemeSwitcher } from "./theme-switcher";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">Neural University</span>
              <span className="text-xs text-muted-foreground leading-none">ИИ-обучение программированию</span>
            </div>
          </div>

          {/* Navigation & Theme Switcher */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#courses" className="text-sm hover:text-primary transition-colors">
                Курсы
              </a>
              <a href="#reviews" className="text-sm hover:text-primary transition-colors">
                Отзывы
              </a>
              <a href="#about" className="text-sm hover:text-primary transition-colors">
                О нас
              </a>
            </nav>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
} 