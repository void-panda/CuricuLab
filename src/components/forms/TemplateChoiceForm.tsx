import { useCVStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Palette, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

export function TemplateChoiceForm() {
    const { cvData, setSettings, setCVData, nextStep } = useCVStore();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSelectTemplate = (templateId: 'creative-ats-01' | 'creative-ats-02') => {
        setSettings({ template: templateId });
        nextStep();
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);
        setUploadSuccess(false);

        try {
            let requestBody: any = { fileName: file.name };

            if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                // Send as base64 for server-side processing
                const base64 = await fileToBase64(file);
                requestBody.fileData = {
                    base64,
                    mimeType: file.type
                };
            } else {
                setUploadError('Hanya file PDF atau DOCX yang diperbolehkan.');
                setIsUploading(false);
                return;
            }

            const response = await fetch('/api/ai/parse-cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal memproses CV.');
            }

            const parsedData = await response.json();

            // Update store with parsed data
            setCVData(parsedData);
            setUploadSuccess(true);

            // Wait a bit to show success before moving to next step
            setTimeout(() => {
                nextStep();
            }, 1500);

        } catch (error: any) {
            console.error('Upload error:', error);
            setUploadError(error.message || 'Gagal mengimpor CV. Silakan coba isi secara manual.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto py-4">
            <div className="text-center space-y-3 mb-10">
                <div className="inline-block bg-yellow-400 border-4 border-black px-4 py-1 mb-4 rotate-1">
                    <span className="text-xs font-black uppercase tracking-widest text-black">LANGKAH 1 DARI 6</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white leading-none">
                    PILIH MULAI DARI MANA
                </h1>
                <p className="text-lg text-muted-foreground font-bold tracking-tight max-w-xl mx-auto">
                    Gunakan template bawaan kami yang sudah teruji atau biarkan AI kami mengimpor data dari CV lama Anda.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
                {/* Formal Template */}
                <div className="group relative">
                    <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
                    <Card
                        className={cn(
                            "relative neo-card cursor-pointer transition-all bg-white dark:bg-zinc-900 border-4 border-black p-0 overflow-hidden h-full flex flex-col",
                            cvData.settings.template === 'creative-ats-01' ? "ring-4 ring-blue-500 ring-offset-4" : ""
                        )}
                        onClick={() => handleSelectTemplate('creative-ats-01')}
                    >
                        <div className="h-32 bg-blue-400 border-b-4 border-black flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                            <FileText className="h-16 w-16 text-black relative z-10 stroke-[2.5]" />
                            <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-black px-2 py-1 uppercase tracking-tighter">
                                ATS SCORE 100
                            </div>
                        </div>
                        <CardHeader className="p-6 flex-grow">
                            <CardTitle className="text-2xl text-black dark:text-white font-black uppercase tracking-tighter mb-2">
                                ATS Formal
                            </CardTitle>
                            <CardDescription className="text-black/80 dark:text-zinc-400 font-bold leading-tight">
                                Design bersih, profesional, dan 100% terbaca oleh mesin ATS. Terbaik untuk korporat.
                            </CardDescription>
                        </CardHeader>
                        <div className="p-6 pt-0 mt-auto">
                            <Button className="w-full neo-card bg-black text-white font-black uppercase group-hover:bg-blue-600 transition-colors py-6">
                                PILIH TEMPLATE INI
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Creative Template */}
                <div className="group relative">
                    <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
                    <Card
                        className={cn(
                            "relative neo-card cursor-pointer transition-all bg-white dark:bg-zinc-900 border-4 border-black p-0 overflow-hidden h-full flex flex-col",
                            cvData.settings.template === 'creative-ats-02' ? "ring-4 ring-purple-500 ring-offset-4" : ""
                        )}
                        onClick={() => handleSelectTemplate('creative-ats-02')}
                    >
                        <div className="h-32 bg-purple-400 border-b-4 border-black flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                            <Palette className="h-16 w-16 text-black relative z-10 stroke-[2.5]" />
                            <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-black px-2 py-1 uppercase tracking-tighter">
                                RECOMMENDED
                            </div>
                        </div>
                        <CardHeader className="p-6 flex-grow">
                            <CardTitle className="text-2xl text-black dark:text-white font-black uppercase tracking-tighter mb-2">
                                Modern Creative
                            </CardTitle>
                            <CardDescription className="text-black/80 dark:text-zinc-400 font-bold leading-tight">
                                Tampil beda dengan layout 2-kolom yang bold. Cocok untuk agensi & startup.
                            </CardDescription>
                        </CardHeader>
                        <div className="p-6 pt-0 mt-auto">
                            <Button className="w-full neo-card bg-black text-white font-black uppercase group-hover:bg-purple-600 transition-colors py-6">
                                PILIH TEMPLATE INI
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Custom Upload */}
                <div className="md:col-span-2 mt-8 group relative">
                    <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
                    <Card
                        className={cn(
                            "relative neo-card cursor-pointer transition-all bg-white dark:bg-zinc-900 border-4 border-black p-0 overflow-hidden",
                            isUploading ? "pointer-events-none" : ""
                        )}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                    >
                        <div className={cn(
                            "transition-colors p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left",
                            uploadSuccess ? "bg-green-400" : (uploadError ? "bg-red-400" : "bg-orange-400")
                        )}>
                            <div className="flex-shrink-0 bg-black border-4 border-white p-6 -rotate-3 group-hover:rotate-0 transition-transform">
                                {isUploading ? (
                                    <Loader2 className="h-20 w-20 text-white animate-spin" />
                                ) : uploadSuccess ? (
                                    <CheckCircle2 className="h-20 w-20 text-white" />
                                ) : uploadError ? (
                                    <AlertCircle className="h-20 w-20 text-white" />
                                ) : (
                                    <Upload className="h-20 w-20 text-white stroke-[3]" />
                                )}
                            </div>

                            <div className="flex-grow space-y-4">
                                <div className="inline-block bg-black text-white text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse border-2 border-white">
                                    PALING CEPAT ⚡
                                </div>
                                <CardTitle className="text-3xl md:text-4xl text-black font-black uppercase tracking-tighter leading-none">
                                    {isUploading ? 'SEDANG MENULIS ULANG...' : uploadSuccess ? 'IMPORT BERHASIL!' : 'IMPORT DENGAN AI MAGIC'}
                                </CardTitle>
                                <CardDescription className="text-black text-lg font-black max-w-2xl leading-tight">
                                    {uploadError || "Sudah punya CV? Upload PDF/DOCX Anda, dan AI kami akan mengisi semua formulir secara otomatis dalam hitungan detik!"}
                                </CardDescription>

                                {!isUploading && !uploadSuccess && (
                                    <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                                        <div className="flex items-center gap-1 bg-white/40 px-3 py-1 border-2 border-black rounded shadow-[2px_2px_0_0_#000]">
                                            <span className="text-sm font-black">PDF</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white/40 px-3 py-1 border-2 border-black rounded shadow-[2px_2px_0_0_#000]">
                                            <span className="text-sm font-black">DOCX</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".pdf,.docx"
                        />
                    </Card>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 mt-12 mb-8">
                <Button
                    variant="ghost"
                    onClick={() => nextStep()}
                    className="group flex flex-col items-center gap-1 hover:bg-transparent"
                >
                    <span className="text-xl font-black uppercase tracking-tighter group-hover:underline underline-offset-8 decoration-4 decoration-black dark:decoration-white">
                        Lewati & Langsung Isi Manual
                    </span>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        MULAI DARI NOL
                    </span>
                </Button>
            </div>
        </div>
    );
}
