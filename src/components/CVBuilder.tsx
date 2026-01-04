// Main CV Builder Component - Combines Form Wizard and Template Preview
import { useState, useEffect } from 'react';
import { useCVStore } from '@/lib/store';
import { FormWizard } from '@/components/forms';
import { TemplateRenderer } from '@/components/templates';
import { OnboardingModal } from '@/components/OnboardingModal';
import { exportToPDF, exportToDOCX } from '@/lib/export';
import { Loader2 } from 'lucide-react';

export function CVBuilder() {
    const { loadFromStorage } = useCVStore();
    const cvData = useCVStore((state) => state.cvData);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Load saved data and set mounted on mount
    useEffect(() => {
        setIsMounted(true);
        loadFromStorage();
    }, []);

    // Return null on server to avoid hydration mismatch
    if (!isMounted) return null;

    const handleExportPDF = async () => {
        setIsExporting(true);
        setExportError(null);
        try {
            await exportToPDF(cvData);
        } catch (error) {
            console.error('PDF export error:', error);
            setExportError('Gagal export PDF. Silakan coba lagi.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportDOCX = async () => {
        setIsExporting(true);
        setExportError(null);
        try {
            await exportToDOCX(cvData);
        } catch (error) {
            console.error('DOCX export error:', error);
            setExportError('Gagal export DOCX. Silakan coba lagi.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <>
            {/* Onboarding Flow */}
            <OnboardingModal />

            <div className="flex h-[calc(100vh-var(--header-height)-var(--footer-height))] flex-col lg:flex-row bg-background dark:bg-muted/30 transition-colors">
                {/* Form Section */}
                <div className="flex-1 border-r-4 border-black lg:max-w-xl bg-white dark:bg-card overflow-hidden transition-colors">
                    <FormWizard
                        onExportPDF={handleExportPDF}
                        onExportDOCX={handleExportDOCX}
                        isExporting={isExporting}
                    />
                </div>

                {/* Preview Section */}
                <div className="flex-1 hidden lg:flex lg:flex-col bg-[#f0f0f0] dark:bg-muted/30 overflow-hidden transition-colors">
                    <TemplateRenderer
                        onExportPDF={handleExportPDF}
                        onExportDOCX={handleExportDOCX}
                        isExporting={isExporting}
                    />
                </div>

                {/* Mobile Preview Toggle - Show on smaller screens */}
                <div className="lg:hidden border-t-4 border-black dark:border-white/10 bg-yellow-400 dark:bg-yellow-500 p-6 flex flex-col items-center gap-4">
                    <p className="text-center font-black uppercase tracking-tight text-black">
                        Pakai laptop/desktop buat liat preview CV-mu secara LIVE! 🚀
                    </p>
                </div>
            </div>

            {/* Export Error Toast */}
            {exportError && (
                <div className="fixed bottom-6 left-6 right-6 z-110 border-4 border-black bg-red-400 p-4 font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom duration-300 flex items-center justify-between">
                    <span>{exportError}</span>
                    <button
                        onClick={() => setExportError(null)}
                        className="bg-black text-white px-3 py-1 text-xs uppercase"
                    >
                        Tutup
                    </button>
                </div>
            )}

            {/* Exporting Overlay */}
            {isExporting && (
                <div className="fixed inset-0 z-120 flex items-center justify-center bg-white/40 dark:bg-black/60 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-6 border-8 border-black dark:border-white/10 bg-white dark:bg-zinc-900 p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)]">
                        <Loader2 className="h-16 w-16 animate-spin text-primary stroke-3" />
                        <span className="text-2xl font-black uppercase tracking-widest text-black dark:text-white">SEDANG EXPORT...</span>
                    </div>
                </div>
            )}
        </>
    );
}
