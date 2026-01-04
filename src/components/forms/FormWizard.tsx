// Form Wizard Component - Step-by-step CV builder
import { useCVStore } from '@/lib/store';
import { WIZARD_STEPS, WIZARD_STEP_LABELS, type WizardStep } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { CertificationForm } from './CertificationForm';
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
    const progress = Math.round(((currentIndex + 1) / steps.length) * 100);

    return (
        <div className="w-full">
            {/* Mobile View: Compact Header + Progress Bar */}
            <div className="flex flex-col gap-3 md:hidden">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="font-mono text-xs font-bold uppercase text-muted-foreground">
                            Langkah {currentIndex + 1} dari {steps.length}
                        </p>
                        <h2 className="mt-1 text-xl font-black uppercase leading-none tracking-tight">
                            {WIZARD_STEP_LABELS[currentStep]}
                        </h2>
                    </div>
                    <span className="font-mono text-xs font-bold">{progress}%</span>
                </div>
                <div className="h-3 w-full border-2 border-black dark:border-white bg-white dark:bg-card p-0.5">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Desktop View: Connected Steps */}
            <div className="hidden md:flex relative items-center justify-between w-full max-w-2xl mx-auto px-4">
                {/* Connecting Line background */}
                <div className="absolute top-1/2 left-0 w-full h-3 -translate-y-1/2 border-2 border-black dark:border-white bg-white dark:bg-card -z-10" />

                {/* Connecting Line Progress */}
                <div
                    className="absolute top-1/2 left-0 h-3 -translate-y-1/2 border-y-2 border-l-2 border-black dark:border-white bg-primary transition-all duration-300 ease-in-out -z-10"
                    style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                />

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
                                "relative flex flex-col items-center gap-2 group transition-all duration-200 outline-none",
                                !isClickable && "cursor-not-allowed opacity-50"
                            )}
                        >
                            {/* Step Circle */}
                            <div className={cn(
                                "flex h-10 w-10 items-center justify-center border-2 border-black dark:border-white font-mono text-sm font-bold transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_white]",
                                isCurrent && "bg-white dark:bg-black text-black dark:text-white scale-110 -translate-y-1 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_white]",
                                isCompleted && "bg-black dark:bg-white text-white dark:text-black",
                                !isCurrent && !isCompleted && "bg-white dark:bg-card text-muted-foreground",
                                isClickable && !isCurrent && "group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[4px_4px_0px_0px_white]"
                            )}>
                                {isCompleted ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    index + 1
                                )}
                            </div>

                            {/* Step Label (Bottom) */}
                            <span className={cn(
                                "absolute top-12 whitespace-nowrap text-xs font-bold uppercase tracking-tight bg-white dark:bg-card px-1 border-black dark:border-white transition-all",
                                isCurrent ? "opacity-100 translate-y-0 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white] py-0.5 rounded-sm z-20" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                            )}>
                                {WIZARD_STEP_LABELS[step]}
                            </span>
                        </button>
                    );
                })}
            </div>
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
        case 'certification':
            return <CertificationForm />;
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
