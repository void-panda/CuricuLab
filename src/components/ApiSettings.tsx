import * as React from "react";
import { Key, Settings, Zap, RotateCcw } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverHeader,
    PopoverTitle,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ApiSettings() {
    const [apiKey, setApiKey] = React.useState<string>("");
    const [hasStoredKey, setHasStoredKey] = React.useState(false);

    React.useEffect(() => {
        const storedKey = sessionStorage.getItem("GEMINI_API_KEY");
        if (storedKey) {
            setHasStoredKey(true);
        }
    }, []);

    const saveApiKey = () => {
        if (!apiKey.trim()) {
            toast.error("Silakan masukkan API Key yang valid");
            return;
        }
        sessionStorage.setItem("GEMINI_API_KEY", apiKey.trim());
        setHasStoredKey(true);
        setApiKey("");
        toast.success("API Key disimpan sementara (Session Only)");
    };

    const resetApiKey = () => {
        sessionStorage.removeItem("GEMINI_API_KEY");
        setHasStoredKey(false);
        toast.success("API Key berhasil dihapus");
    };

    return (
        <Popover>
            <PopoverTrigger render={
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Settings className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">AI Settings</span>
                </Button>
            } />
            <PopoverContent align="end" className="w-80 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                <PopoverHeader>
                    <PopoverTitle className="flex items-center gap-2 text-base font-black uppercase tracking-tight">
                        <Key className="h-4 w-4" />
                        Gemini API Key
                    </PopoverTitle>
                </PopoverHeader>

                <div className="space-y-4 pt-2">
                    <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                        Gunakan API Key pribadimu untuk fitur AI. Key hanya disimpan di <span className="text-foreground">sessionStorage</span> dan akan terhapus jika tab ditutup.
                    </p>
                    <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                        Temukan API Key-mu di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://aistudio.google.com/app/apikey</a>
                    </p>

                    {hasStoredKey ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 rounded-sm border-2 border-black bg-green-100 dark:bg-green-900/30 p-2 text-xs font-bold text-green-700 dark:text-green-400">
                                <Zap className="h-4 w-4 fill-current" />
                                API Key Aktif (Local Mode)
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetApiKey}
                                className="w-full border-2 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-red-400 text-white hover:bg-red-500"
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Hapus Key
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Input
                                type="password"
                                placeholder="AIzaSy..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            />
                            <Button
                                size="sm"
                                onClick={saveApiKey}
                                className="w-full border-2 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-primary text-white"
                            >
                                Simpan Key
                            </Button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
