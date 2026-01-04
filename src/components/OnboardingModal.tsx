import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Save, Laptop, Wand2, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('curiculab-onboarding-seen');
        if (!hasSeenOnboarding) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem('curiculab-onboarding-seen', 'true');
        setIsOpen(false);
    };

    const nextStep = () => {
        if (step < ONBOARDING_STEPS.length - 1) {
            setStep(step + 1);
        } else {
            handleClose();
        }
    };

    if (!isOpen) return null;

    const currentStep = ONBOARDING_STEPS[step];

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="neo-card w-full max-w-lg bg-white dark:bg-zinc-900 overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className={cn("h-32 flex items-center justify-center border-b-4 border-black dark:border-white/10", currentStep.color)}>
                    <currentStep.icon className="h-16 w-16 text-black stroke-3" />
                </div>

                <div className="p-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                            STEP {step + 1} / {ONBOARDING_STEPS.length}
                        </span>
                        <button onClick={handleClose} className="hover:rotate-90 transition-transform">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none text-black dark:text-white">
                        {currentStep.title}
                    </h2>
                    <p className="text-lg font-bold text-black/70 dark:text-white/70 mb-8 leading-tight">
                        {currentStep.description}
                    </p>

                    <div className="flex gap-4">
                        {step > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => setStep(step - 1)}
                                className="flex-1 h-14 border-4 border-black dark:border-white/10 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-white dark:bg-zinc-800 text-black dark:text-white"
                            >
                                BACK
                            </Button>
                        )}
                        <Button
                            onClick={nextStep}
                            className={cn(
                                "flex-1 h-14 border-4 border-black dark:border-white/10 font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-px hover:translate-y-px hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all gap-2",
                                step === ONBOARDING_STEPS.length - 1 ? "bg-green-400 text-black" : "bg-primary text-white"
                            )}
                        >
                            {step === ONBOARDING_STEPS.length - 1 ? "LET'S GO!" : "NEXT"}
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ONBOARDING_STEPS = [
    {
        title: "Selamat Datang!",
        description: "Bosan dengan CV yang biasa saja? CuricuLab hadir untuk membantumu tampil beda dengan gaya Neobrutalism yang berani.",
        icon: Sparkles,
        color: "bg-yellow-400"
    },
    {
        title: "Kekuatan AI Gemini",
        description: "Gunakan tombol AI untuk memulas pengalaman kerjamu jadi lebih profesional dan ATS-friendly secara instan.",
        icon: Wand2,
        color: "bg-purple-400"
    },
    {
        title: "Privasi Utama",
        description: "Semua datamu tersimpan di browsermu sendiri. Kami tidak menyimpan rahasiamu di server kami.",
        icon: Save,
        color: "bg-green-400"
    },
    {
        title: "Live Preview",
        description: "Lihat hasil karyamu secara langsung di sisi kanan layar. Sesuaikan template kapan saja!",
        icon: Laptop,
        color: "bg-blue-400"
    }
];
