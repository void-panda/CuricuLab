import { Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container-wrapper px-8">
        <div className="flex h-(--footer-height) flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Data Anda tersimpan di browser. Privasi terjamin.</span>
          </div>
          <div className="text-muted-foreground text-center text-xs leading-loose">
            Made with{" "}
            <Heart className="inline-block h-3 w-3 text-red-500 fill-red-500" />{" "}
            by CuricuLab Team
          </div>
        </div>
      </div>
    </footer>
  );
}
