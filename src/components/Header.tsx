import * as React from "react";
import { FileText, Sparkles } from "lucide-react";
import { MobileNav } from "@/components/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container-wrapper 3xl:fixed:px-0 px-6">
        <div className="3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:h-4!">
          <MobileNav className="flex lg:hidden" />

          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <span className="hidden font-bold sm:inline-block">CuricuLab</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="ml-6 hidden items-center gap-4 lg:flex">
            <a
              href="/builder"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Buat CV
            </a>
            <a
              href="/#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Fitur
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <a href="/builder">
              <Button size="sm" className="hidden gap-2 sm:inline-flex">
                <Sparkles className="h-4 w-4" />
                Mulai Buat CV
              </Button>
            </a>

            <Separator orientation="vertical" className="my-auto hidden sm:block" />

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
