import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    setMounted(true);
    setTheme(getInitialTheme());
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  React.useEffect(() => {
    if (!mounted) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = () => {
      if (!localStorage.getItem("theme")) {
        setTheme(media.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [mounted]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const isDark = mounted && theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      aria-pressed={isDark}
    >
      {isDark ? <Moon className="size-5" /> : <Sun className="size-6" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
