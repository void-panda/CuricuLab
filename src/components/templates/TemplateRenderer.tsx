// Template Renderer - Displays CV preview with template switching
import { useCVStore } from '@/lib/store';
import { CreativeATS01 } from './CreativeATS01';
import { CreativeATS02 } from './CreativeATS02';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, FileText, LayoutTemplate, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const TEMPLATES = [
    { id: 'creative-ats-01', name: 'Klasik Modern', component: CreativeATS01 },
    { id: 'creative-ats-02', name: 'Kreatif Sidebar', component: CreativeATS02 },
] as const;

interface TemplateRendererProps {
    onExportPDF?: () => void;
    onExportDOCX?: () => void;
    isExporting?: boolean;
}

export function TemplateRenderer({
    onExportPDF,
    onExportDOCX,
    isExporting = false
}: TemplateRendererProps) {
    const { cvData, setSettings } = useCVStore();
    const [showOptions, setShowOptions] = useState(false);
    const currentTemplate = cvData.settings.template;
    const exportOptions = cvData.settings.exportOptions || {
        margin: 'normal' as const,
        pageSize: 'a4' as const,
        filenamePrefix: 'CV'
    };
    const { margin, pageSize, filenamePrefix } = exportOptions;

    const TemplateComponent = TEMPLATES.find(t => t.id === currentTemplate)?.component || CreativeATS01;

    const updateExportOptions = (updates: Partial<typeof cvData.settings.exportOptions>) => {
        setSettings({
            exportOptions: {
                ...cvData.settings.exportOptions,
                ...updates
            }
        });
    };

    return (
        <div className="flex h-full flex-col bg-[#f0f0f0] dark:bg-muted/50 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-black bg-white dark:bg-card p-4 transition-colors">
                <div className="flex items-center gap-2">
                    <LayoutTemplate className="h-6 w-6 text-black dark:text-white" />
                    <span className="font-black uppercase tracking-tighter text-xl text-black dark:text-white">PREVIEW CV</span>
                </div>

                {/* Template & Options Selector */}
                <div className="flex gap-2">
                    {TEMPLATES.map((template) => (
                        <Button
                            key={template.id}
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={() => setSettings({ template: template.id as typeof currentTemplate })}
                            className={cn(
                                "h-10 border-2 border-black dark:border-white font-bold uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white]",
                                currentTemplate === template.id
                                    ? "bg-primary text-white"
                                    : "bg-white dark:bg-background text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                        >
                            {template.name}
                        </Button>
                    ))}
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => setShowOptions(!showOptions)}
                        className={cn(
                            "h-10 border-2 border-black dark:border-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white] transition-all",
                            showOptions ? 'bg-yellow-400 text-black' : 'bg-white dark:bg-background text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
                        )}
                    >
                        <Settings2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Options Panel */}
            {showOptions && (
                <div className="grid grid-cols-1 gap-6 border-b-4 border-black bg-white dark:bg-card p-6 md:grid-cols-3 animate-in slide-in-from-top duration-300 transition-colors">
                    <div className="space-y-2">
                        <Label htmlFor="margin" className="font-black uppercase text-xs text-black dark:text-white">Margin</Label>
                        <Select
                            value={margin}
                            onValueChange={(value) => updateExportOptions({ margin: value as any })}
                        >
                            <SelectTrigger id="margin" className="h-10 border-2 border-black dark:border-white font-bold bg-white dark:bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white]">
                                <SelectItem value="narrow">Narrow (5mm)</SelectItem>
                                <SelectItem value="normal">Normal (10mm)</SelectItem>
                                <SelectItem value="wide">Wide (20mm)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pageSize" className="font-black uppercase text-xs text-black dark:text-white">Ukuran Kertas</Label>
                        <Select
                            value={pageSize}
                            onValueChange={(value) => updateExportOptions({ pageSize: value as any })}
                        >
                            <SelectTrigger id="pageSize" className="h-10 border-2 border-black dark:border-white font-bold bg-white dark:bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white]">
                                <SelectItem value="a4">A4</SelectItem>
                                <SelectItem value="letter">Letter</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="filename" className="font-black uppercase text-xs text-black dark:text-white">Prefix Filename</Label>
                        <Input
                            id="filename"
                            value={filenamePrefix}
                            onChange={(e) => updateExportOptions({ filenamePrefix: e.target.value })}
                            placeholder="Contoh: CV_Zannns"
                            className="h-10 border-2 border-black dark:border-white font-bold bg-white dark:bg-background"
                        />
                    </div>
                </div>
            )}

            {/* CV Preview */}
            <div className="flex-1 overflow-y-auto p-8 md:p-24 flex justify-center items-start bg-[#f0f0f0] dark:bg-muted/50 transition-colors">
                <div className="border-8 border-black dark:border-white bg-black dark:bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,0.2)]">
                    <div
                        id="cv-preview"
                        className="bg-white p-12"
                        style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
                    >
                        <TemplateComponent data={cvData} />
                    </div>
                </div>
            </div>

            {/* Export Actions */}
            <div className="flex items-center justify-center gap-6 border-t-4 border-black bg-white dark:bg-card p-6 transition-colors">
                <Button
                    type="button"
                    onClick={onExportPDF}
                    disabled={isExporting}
                    className="h-14 border-4 border-black dark:border-white px-8 font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_white] active:translate-x-px active:translate-y-px active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-green-400 text-black gap-2"
                >
                    <FileDown className="h-6 w-6 stroke-3" />
                    EXPORT PDF
                </Button>
                <Button
                    type="button"
                    variant="default"
                    onClick={onExportDOCX}
                    disabled={isExporting}
                    className="h-14 border-4 border-black dark:border-white px-8 font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_white] active:translate-x-px active:translate-y-px active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-blue-400 text-white gap-2"
                >
                    <FileText className="h-6 w-6 stroke-3" />
                    EXPORT DOCX
                </Button>
            </div>
        </div>
    );
}
