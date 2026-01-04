import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={(triggerProps) => (
          <Button
            {...triggerProps}
            variant="ghost"
            className={cn(
              "extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 p-0! hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent",
              className,
            )}
          >
            <div className="relative flex h-8 w-4 items-center justify-center">
              <div className="relative size-4">
                <span
                  className={cn(
                    "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                    open ? "top-[0.4rem] -rotate-45" : "top-1",
                  )}
                />
                <span
                  className={cn(
                    "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                    open ? "top-[0.4rem] rotate-45" : "top-2.5",
                  )}
                />
              </div>
              <span className="sr-only">Toggle Menu</span>
            </div>
          </Button>
        )}
      />

      <PopoverContent
        className="bg-background/95 h-[calc(100vh-var(--header-height))] w-screen overflow-y-auto border-t p-0 shadow-xl backdrop-blur-sm animate-in slide-in-from-top-2 duration-200"
        align="end"
        side="bottom"
        alignOffset={0}
        sideOffset={0}
      >
        <div className="flex flex-col gap-8 p-8">
          <div className="flex flex-col gap-4">
            <div className="text-muted-foreground text-sm font-medium">Menu</div>

            <div className="flex flex-col gap-3">
              <a href="/" className="text-2xl font-medium" onClick={() => setOpen(false)}>
                Beranda
              </a>
              <a
                href="/builder"
                className="text-2xl font-medium"
                onClick={() => setOpen(false)}
              >
                Buat CV
              </a>
              <a
                href="/#features"
                className="text-2xl font-medium"
                onClick={() => setOpen(false)}
              >
                Fitur
              </a>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
