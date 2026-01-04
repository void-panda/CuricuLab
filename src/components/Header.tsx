import * as React from "react";
import { FileText, Github, Sparkles } from "lucide-react";
import { MobileNav } from "@/components/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ApiSettings } from "@/components/ApiSettings";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container-wrapper 3xl:fixed:px-8 px-8">
        <div className="3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:h-4!">


          {/* Logo */}
          <a href="/" id="step-logo" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <span className="text-xl sm:text-2xl font-black tracking-tighter flex items-center">
              Curicu<span className="text-primary">Lab</span>
              <span className="text-primary ml-0.5 animate-pulse">.</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="ml-6 hidden items-center gap-4 lg:flex">
            <a
              href="/#preview"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Preview AI
            </a>
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
            <a
              href="/#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Proses
            </a>
            <a
              href="/#templates"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Template
            </a>
            <a
              href="/#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimoni
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <a href="/builder" id="step-build-btn">
              <Button size="sm" className="hidden gap-2 sm:inline-flex">
                <Sparkles className="h-4 w-4" />
                Mulai Buat CV
              </Button>
            </a>

            <Separator orientation="vertical" className="my-auto hidden sm:block" />

            <a
              href="https://github.com/void-panda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Github className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">GitHub</span>
              </Button>
            </a>
            <ThemeToggle />
            <div id="step-settings">
              <ApiSettings />
            </div>
            <MobileNav className="flex lg:hidden" />
          </div>
        </div>
      </div>
    </header>
  );
}
