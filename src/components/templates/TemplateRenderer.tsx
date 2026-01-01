// Template Renderer - Displays CV preview with template switching
import { useCVStore } from '@/lib/store';
import { CreativeATS01 } from './CreativeATS01';
import { CreativeATS02 } from './CreativeATS02';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileDown, FileText, LayoutTemplate } from 'lucide-react';

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
    const currentTemplate = cvData.settings.template;

    const TemplateComponent = TEMPLATES.find(t => t.id === currentTemplate)?.component || CreativeATS01;

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-2">
                    <LayoutTemplate className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Preview CV</span>
                </div>

                {/* Template Selector */}
                <div className="flex gap-2">
                    {TEMPLATES.map((template) => (
                        <Button
                            key={template.id}
                            type="button"
                            variant={currentTemplate === template.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSettings({ template: template.id as typeof currentTemplate })}
                        >
                            {template.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* CV Preview */}
            <div className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
                <Card className="mx-auto max-w-[210mm] overflow-hidden shadow-lg">
                    <div
                        id="cv-preview"
                        className="bg-white p-8"
                        style={{ minHeight: '297mm' }}
                    >
                        <TemplateComponent data={cvData} />
                    </div>
                </Card>
            </div>

            {/* Export Actions */}
            <div className="flex items-center justify-center gap-4 border-t bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <Button
                    type="button"
                    onClick={onExportPDF}
                    disabled={isExporting}
                    className="gap-2"
                >
                    <FileDown className="h-4 w-4" />
                    Export PDF
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onExportDOCX}
                    disabled={isExporting}
                    className="gap-2"
                >
                    <FileText className="h-4 w-4" />
                    Export DOCX
                </Button>
            </div>
        </div>
    );
}
