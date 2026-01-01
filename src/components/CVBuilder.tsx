// Main CV Builder Component - Combines Form Wizard and Template Preview
import { useState, useEffect } from 'react';
import { useCVStore } from '@/lib/store';
import { FormWizard } from '@/components/forms';
import { TemplateRenderer } from '@/components/templates';
import { exportToPDF, exportToDOCX } from '@/lib/export';
import { Loader2 } from 'lucide-react';

export function CVBuilder() {
    const { loadFromStorage } = useCVStore();
    const cvData = useCVStore((state) => state.cvData);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    // Load saved data on mount
    useEffect(() => {
        loadFromStorage();
    }, []);

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
        <div className="flex h-[calc(100vh-var(--header-height)-var(--footer-height))] flex-col lg:flex-row">
            {/* Form Section */}
            <div className="flex-1 border-r lg:max-w-xl">
                <FormWizard />
            </div>

            {/* Preview Section */}
            <div className="flex-1 hidden lg:flex lg:flex-col">
                <TemplateRenderer
                    onExportPDF={handleExportPDF}
                    onExportDOCX={handleExportDOCX}
                    isExporting={isExporting}
                />
            </div>

            {/* Mobile Preview Toggle - Show on smaller screens */}
            <div className="lg:hidden border-t p-4">
                <p className="text-center text-sm text-muted-foreground">
                    Gunakan layar lebih besar untuk melihat preview CV secara real-time
                </p>
            </div>

            {/* Export Error Toast */}
            {exportError && (
                <div className="fixed bottom-4 right-4 rounded-lg bg-destructive p-4 text-destructive-foreground shadow-lg">
                    {exportError}
                    <button
                        onClick={() => setExportError(null)}
                        className="ml-2 underline"
                    >
                        Tutup
                    </button>
                </div>
            )}

            {/* Exporting Overlay */}
            {isExporting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 rounded-lg bg-card p-6 shadow-lg">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Mengexport CV...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
