// Form Wizard Component - Step-by-step CV builder
import { useCVStore } from '@/lib/store';
import { WIZARD_STEPS, WIZARD_STEP_LABELS, type WizardStep } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ChevronLeft, ChevronRight, Check, Eye } from 'lucide-react';
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
                            "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                            isCurrent && "bg-primary text-primary-foreground",
                            isCompleted && "bg-primary/20 text-primary hover:bg-primary/30",
                            !isCurrent && !isCompleted && "bg-muted text-muted-foreground",
                            isClickable && !isCurrent && "cursor-pointer",
                            !isClickable && "cursor-not-allowed opacity-50"
                        )}
                    >
                        <span className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                            isCurrent && "bg-primary-foreground/20",
                            isCompleted && "bg-primary"
                        )}>
                            {isCompleted ? (
                                <Check className="h-3 w-3 text-primary-foreground" />
                            ) : (
                                index + 1
                            )}
                        </span>
                        <span className="hidden sm:inline">{WIZARD_STEP_LABELS[step]}</span>
                    </button>
                );
            })}
        </div>
    );
}

// Render the current step's form
function StepContent({ step }: { step: WizardStep }) {
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
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <Eye className="h-16 w-16 text-muted-foreground/50" />
                    <h2 className="text-2xl font-bold">Preview CV Anda</h2>
                    <p className="text-muted-foreground">
                        Lihat preview CV di sebelah kanan dan export ke PDF atau DOCX
                    </p>
                </div>
            );
        default:
            return null;
    }
}

export function FormWizard() {
    const { currentStep, setCurrentStep, nextStep, prevStep } = useCVStore();
    const currentIndex = WIZARD_STEPS.indexOf(currentStep);
    const isFirstStep = currentIndex === 0;
    const isLastStep = currentIndex === WIZARD_STEPS.length - 1;

    return (
        <div className="flex h-full flex-col">
            {/* Step Indicator */}
            <div className="border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <StepIndicator
                    steps={WIZARD_STEPS}
                    currentStep={currentStep}
                    onStepClick={setCurrentStep}
                />
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="mx-auto max-w-2xl">
                    <StepContent step={currentStep} />
                </div>
            </div>

            {/* Navigation */}
            <div className="border-t bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex max-w-2xl items-center justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={isFirstStep}
                        className="gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Sebelumnya
                    </Button>

                    <span className="text-sm text-muted-foreground">
                        Langkah {currentIndex + 1} dari {WIZARD_STEPS.length}
                    </span>

                    <Button
                        type="button"
                        onClick={nextStep}
                        disabled={isLastStep}
                        className="gap-2"
                    >
                        {isLastStep ? 'Selesai' : 'Selanjutnya'}
                        {!isLastStep && <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
