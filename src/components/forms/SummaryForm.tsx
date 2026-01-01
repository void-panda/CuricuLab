// Professional Summary Form with AI Enhancement
import { useState } from 'react';
import { useCVStore } from '@/lib/store';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Sparkles, Loader2 } from 'lucide-react';
import { enhanceSummary } from '@/lib/api';

export function SummaryForm() {
    const { cvData, setSummary } = useCVStore();
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEnhance = async () => {
        if (!cvData.summary.trim()) {
            setError('Mohon isi ringkasan terlebih dahulu sebelum menggunakan AI');
            return;
        }

        setIsEnhancing(true);
        setError(null);

        try {
            const enhanced = await enhanceSummary(
                cvData.summary,
                cvData.settings.targetRole,
                cvData.settings.language
            );
            setSummary(enhanced);
        } catch (err) {
            setError('Gagal meningkatkan ringkasan. Silakan coba lagi.');
            console.error('Enhancement error:', err);
        } finally {
            setIsEnhancing(false);
        }
    };

    return (
        <Card className="neo-card w-full">
            <CardHeader className="border-b-4 border-black dark:border-white bg-yellow-400 p-6 -mt-8 text-black">
                <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase tracking-tighter">
                    <FileText className="h-5 w-5" />
                    Profil Diri
                </CardTitle>
                <CardDescription className="font-bold text-black/80">
                    Tulis ringkasan singkat tentang diri Anda, pengalaman, dan tujuan karir
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
                {/* Target Role */}
                <div className="space-y-2">
                    <Label htmlFor="targetRole">Posisi yang Dilamar</Label>
                    <input
                        id="targetRole"
                        type="text"
                        placeholder="Contoh: Frontend Developer, UI/UX Designer"
                        value={cvData.settings.targetRole}
                        onChange={(e) =>
                            useCVStore.getState().setSettings({ targetRole: e.target.value })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <p className="text-xs text-muted-foreground">
                        AI akan menggunakan posisi ini untuk menyesuaikan konten CV Anda
                    </p>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                    <Label htmlFor="summary">Ringkasan</Label>
                    <Textarea
                        id="summary"
                        placeholder="Tulis ringkasan profesional Anda di sini. Contoh: Saya adalah seorang Frontend Developer dengan pengalaman 3 tahun dalam membangun aplikasi web modern menggunakan React dan TypeScript..."
                        value={cvData.summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows={6}
                        className="resize-none"
                    />
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            {cvData.summary.length}/500 karakter (disarankan)
                        </p>
                    </div>
                </div>

                {/* AI Enhancement Button */}
                <div className="flex flex-col gap-2 pt-4">
                    <Button
                        type="button"
                        variant="default"
                        onClick={handleEnhance}
                        disabled={isEnhancing || !cvData.summary.trim()}
                        className="h-14 border-4 border-black dark:border-white font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_white] hover:translate-x-px hover:translate-y-px hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-green-400 text-black gap-2"
                    >
                        {isEnhancing ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                MENINGKATKAN...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5" />
                                TINGKATKAN DENGAN AI
                            </>
                        )}
                    </Button>
                    <p className="font-mono text-xs font-bold text-center uppercase tracking-tighter">
                        AI Gemini akan menyulap ringkasanmu jadi gila!
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
