"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CONENT_RESOURCES } from "./main-page-ui/content-resources";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  return (
    <header className="fixed top-0 left-0 min-w-screen w-full z-50 bg-background/80 backdrop-blur-md border-b border-border h-20">
      <div className="container mx-auto max-w-6xl h-full flex items-center w-full justify-between px-5">
        {/* Logo & Brand */}
        <div 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          onClick={() => router.push('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-lg leading-none">
              Neural University
            </span>
            <span className="text-xs text-muted-foreground leading-none">
              ИИ-обучение программированию
            </span>
          </div>
        </div>

        {/* Navigation & Theme Switcher */}

        <div className="flex items-center gap-4 md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MenuIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-66 bg-background border border-border shadow-lg">
              {Object.values(CONENT_RESOURCES).map(
                (link: {
                  section_id: string;
                  navTitle: string;
                  isNavigated: boolean;
                }) =>
                  link.isNavigated ? (
                    <DropdownMenuItem key={`${link.section_id}`} asChild>
                      <Link
                        href={`/#${link.section_id}`}
                        className="block px-7 py-5 border-b text-sm hover:text-primary font-semibold transition-colors cursor-pointer"
                      >
                        {link.navTitle}
                      </Link>
                    </DropdownMenuItem>
                  ) : null
              )}
              <DropdownMenuItem asChild>
                <Link
                  href={`/courses`}
                  className="block px-7 py-5 border-b text-sm hover:text-primary font-semibold transition-colors cursor-pointer"
                >
                  Курсы
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className=" items-center gap-4 hidden md:flex">
          <nav className="hidden md:flex items-center gap-6">
            {Object.values(CONENT_RESOURCES).map(
              (link: {
                section_id: string;
                navTitle: string;
                isNavigated: boolean;
              }) =>
                link.isNavigated ? (
                  <Link
                    key={link.section_id}
                    href={`/#${link.section_id}`}
                    className="text-md hover:text-primary font-semibold transition-colors"
                  >
                    {link.navTitle}
                  </Link>
                ) : null
            )}
            <Link
              href={`/courses`}
              className="text-md hover:text-primary font-semibold transition-colors"
            >
              Курсы
            </Link>  
          </nav>
        </div>
      </div>
    </header>
  );
}
