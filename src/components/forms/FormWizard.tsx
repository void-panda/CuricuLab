// Form Wizard Component - Step-by-step CV builder
import { useCVStore } from '@/lib/store';
import { WIZARD_STEPS, WIZARD_STEP_LABELS, type WizardStep } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ChevronLeft, ChevronRight, Check, Eye, FileDown, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

// Step indicator component
function StepIndicator({
    steps,
    currentStep,
    onStepClick
}: {
    steps: WizardStep[];
    currentStep: WizardStep;
    onStepClick: (step: WizardStep) => void;
}) {
    const currentIndex = steps.indexOf(currentStep);

    return (
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {steps.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = step === currentStep;
                const isClickable = index <= currentIndex + 1;

                return (
                    <button
                        key={step}
                        type="button"
                        onClick={() => isClickable && onStepClick(step)}
                        disabled={!isClickable}
                        className={cn(
                            "flex items-center gap-2 border-2 border-black dark:border-white px-4 py-2 text-sm font-bold transition-all",
                            isCurrent && "bg-primary text-primary-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_white]",
                            isCompleted && "bg-primary/20 text-black dark:text-white border-black/40 dark:border-white/40",
                            !isCurrent && !isCompleted && "bg-white dark:bg-background text-black/40 dark:text-white/40 border-black/20 dark:border-white/20",
                            isClickable && !isCurrent && "cursor-pointer hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_0px_white]",
                            !isClickable && "cursor-not-allowed opacity-50"
                        )}
                    >
                        <span className={cn(
                            "flex h-6 w-6 items-center justify-center border-2 border-black dark:border-white font-mono text-xs",
                            isCurrent && "bg-white dark:bg-black text-black dark:text-white",
                            isCompleted && "bg-black dark:bg-white text-white dark:text-black"
                        )}>
                            {isCompleted ? (
                                <Check className="h-3 w-3" />
                            ) : (
                                index + 1
                            )}
                        </span>
                        <span className="hidden sm:inline uppercase tracking-tighter">{WIZARD_STEP_LABELS[step]}</span>
                    </button>
                );
            })}
        </div>
    );
}

// Render the current step's form
function StepContent({
    step,
    onExportPDF,
    onExportDOCX,
    isExporting
}: {
    step: WizardStep;
    onExportPDF?: () => void;
    onExportDOCX?: () => void;
    isExporting: boolean;
}) {
    switch (step) {
        case 'personal':
            return <PersonalInfoForm />;
        case 'summary':
            return <SummaryForm />;
        case 'experience':
            return <ExperienceForm />;
        case 'education':
            return <EducationForm />;
        case 'skills':
            return <SkillsForm />;
        case 'preview':
            return (
                <div className="flex flex-col items-center justify-center gap-6 py-8 text-center sm:py-12">
                    <div className="rounded-full bg-primary/10 p-6 dark:bg-primary/20">
                        <Eye className="h-16 w-16 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white">SIAP DIKIRIM? 🚀</h2>
                        <p className="text-muted-foreground max-w-sm px-4">
                            Cek kembali data Anda. Jika sudah oke, silakan download CV Anda di bawah ini.
                        </p>
                    </div>

                    {/* Mobile Export Buttons - Hidden on Desktop as TemplateRenderer shows them */}
                    <div className="flex flex-col gap-4 w-full px-4 lg:hidden">
                        <Button
                            type="button"
                            onClick={onExportPDF}
                            disabled={isExporting}
                            className="h-14 border-4 border-black px-8 font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_white] active:translate-x-px active:translate-y-px active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-green-400 text-black gap-2"
                        >
                            <FileDown className="h-6 w-6 stroke-3" />
                            DOWNLOAD PDF
                        </Button>
                        <Button
                            type="button"
                            onClick={onExportDOCX}
                            disabled={isExporting}
                            className="h-14 border-4 border-black px-8 font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_white] active:translate-x-px active:translate-y-px active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-blue-400 text-white gap-2"
                        >
                            <FileText className="h-6 w-6 stroke-3" />
                            DOWNLOAD DOCX
                        </Button>
                    </div>

                    <p className="text-sm font-medium text-muted-foreground hidden lg:block">
                        Lihat preview CV di sebelah kanan dan gunakan tombol export di bawah preview.
                    </p>
                </div>
            );
        default:
            return null;
    }
}

interface FormWizardProps {
    onExportPDF?: () => void;
    onExportDOCX?: () => void;
    isExporting?: boolean;
}

export function FormWizard({
    onExportPDF,
    onExportDOCX,
    isExporting = false
}: FormWizardProps) {
    const { currentStep, setCurrentStep, nextStep, prevStep } = useCVStore();
    const currentIndex = WIZARD_STEPS.indexOf(currentStep);
    const isFirstStep = currentIndex === 0;
    const isLastStep = currentIndex === WIZARD_STEPS.length - 1;

    return (
        <div className="flex h-full flex-col bg-white dark:bg-card transition-colors">
            {/* Step Indicator */}
            <div className="border-b-4 border-black bg-white dark:bg-card p-4 transition-colors">
                <StepIndicator
                    steps={WIZARD_STEPS}
                    currentStep={currentStep}
                    onStepClick={setCurrentStep}
                />
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white dark:bg-card transition-colors">
                <div className="mx-auto max-w-2xl">
                    <StepContent
                        step={currentStep}
                        onExportPDF={onExportPDF}
                        onExportDOCX={onExportDOCX}
                        isExporting={isExporting}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="border-t-4 border-black bg-white dark:bg-card p-6 transition-colors">
                <div className="mx-auto flex max-w-2xl items-center justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={isFirstStep}
                        className="h-12 border-2 border-black dark:border-white px-6 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all gap-2 dark:bg-background"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        PREVIOUS
                    </Button>

                    <span className="font-mono text-sm font-bold uppercase tracking-widest hidden sm:inline text-black dark:text-white">
                        STEP {currentIndex + 1}/{WIZARD_STEPS.length}
                    </span>

                    <Button
                        type="button"
                        onClick={nextStep}
                        disabled={isLastStep}
                        className={cn(
                            "h-12 border-2 border-black dark:border-white px-8 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-primary text-white gap-2 uppercase",
                            isLastStep && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isLastStep ? 'FINISH' : 'NEXT'}
                        {!isLastStep && <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
