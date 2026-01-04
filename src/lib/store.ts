// Zustand store for CV data state management
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { CVData, WizardStep, Experience, Education, Skill } from '@/types/cv';
import { defaultCVData, WIZARD_STEPS } from '@/types/cv';
import { saveCV, loadCV } from '@/lib/storage';
import { nanoid } from 'nanoid';

interface CVStore {
    // CV Data
    cvData: CVData;

    // Wizard State
    currentStep: WizardStep;
    isLoading: boolean;
    isSaving: boolean;

    // Actions - Data
    setCVData: (data: Partial<CVData>) => void;
    setPersonal: (personal: Partial<CVData['personal']>) => void;
    setSummary: (summary: string) => void;
    setSettings: (settings: Partial<CVData['settings']>) => void;

    // Actions - Experience
    addExperience: () => void;
    updateExperience: (id: string, data: Partial<Experience>) => void;
    removeExperience: (id: string) => void;
    reorderExperience: (startIndex: number, endIndex: number) => void;

    // Actions - Education
    addEducation: () => void;
    updateEducation: (id: string, data: Partial<Education>) => void;
    removeEducation: (id: string) => void;
    reorderEducation: (startIndex: number, endIndex: number) => void;

    // Actions - Skills
    addSkill: (skill: Omit<Skill, 'id'>) => void;
    removeSkill: (id: string) => void;

    // Actions - Wizard
    setCurrentStep: (step: WizardStep) => void;
    nextStep: () => void;
    prevStep: () => void;

    // Actions - Storage
    loadFromStorage: () => void;
    saveToStorage: () => void;
    resetCV: () => void;
}

export const useCVStore = create<CVStore>()(
    subscribeWithSelector((set, get) => ({
        // Initial State
        cvData: defaultCVData,
        currentStep: 'personal',
        isLoading: false,
        isSaving: false,

        // Set partial CV data
        setCVData: (data) => {
            set((state) => ({
                cvData: { ...state.cvData, ...data },
            }));
            get().saveToStorage();
        },

        // Set personal info
        setPersonal: (personal) => {
            set((state) => ({
                cvData: {
                    ...state.cvData,
                    personal: { ...state.cvData.personal, ...personal },
                },
            }));
            get().saveToStorage();
        },

        // Set summary
        setSummary: (summary) => {
            set((state) => ({
                cvData: { ...state.cvData, summary },
            }));
            get().saveToStorage();
        },

        // Set settings
        setSettings: (settings) => {
            set((state) => ({
                cvData: {
                    ...state.cvData,
                    settings: { ...state.cvData.settings, ...settings },
                },
            }));
            get().saveToStorage();
        },

        // Add new experience
        addExperience: () => {
            const newExp: Experience = {
                id: nanoid(),
                company: '',
                position: '',
                startDate: '',
                endDate: null,
                description: [''],
                location: '',
            };
            set((state) => ({
                cvData: {
                    ...state.cvData,
                    experiences: [...state.cvData.experiences, newExp],
                },
            }));
            get().saveToStorage();
        },

        // Update experience
        updateExperience: (id, data) => {
            set((state) => ({
                cvData: {
                    ...state.cvData,
                    experiences: state.cvData.experiences.map((exp) =>
                        exp.id === id ? { ...exp, ...data } : exp
                    ),
                },
            }));
            get().saveToStorage();
        },

        // Remove experience
        removeExperience: (id) => {
            set((state) => ({
                cvData: {
                    ...state.cvData,
                    experiences: state.cvData.experiences.filter((exp) => exp.id !== id),
                },
            }));
            get().saveToStorage();
        },

        // Reorder experience
        reorderExperience: (startIndex, endIndex) => {
            const list = [...get().cvData.experiences];
            const [removed] = list.splice(startIndex, 1);
            list.splice(endIndex, 0, removed);
            set((state) => ({
                cvData: {
                    ...state.cvData,
                    experiences: list,
                },
            }));
            get().saveToStorage();
        },

        // Add new education
        addEducation: () => {
            const newEdu: Education = {
                id: nanoid(),
                institution: '',
                degree: '',
                field: '',
                startDate: '',
                endDate: '',
            };
            set((state) => ({
                cvData: {
                    ...state.cvData,
                    education: [...state.cvData.education, newEdu],
                },
            }));
            get().saveToStorage();
        },

        // Update education
        updateEducation: (id, data) => {
            set((state) => ({
                cvData: {
                    ...state.cvData,
                    education: state.cvData.education.map((edu) =>
                        edu.id === id ? { ...edu, ...data } : edu
                    ),
                },
            }));
            get().saveToStorage();
        },

        // Remove education
        removeEducation: (id) => {
            set((state) => ({
                cvData: {
                    ...state.cvData,
                    education: state.cvData.education.filter((edu) => edu.id !== id),
                },
            }));
            get().saveToStorage();
        },

        // Reorder education
        reorderEducation: (startIndex, endIndex) => {
            const list = [...get().cvData.education];
            const [removed] = list.splice(startIndex, 1);
            list.splice(endIndex, 0, removed);
            set((state) => ({
                cvData: {
                    ...state.cvData,
                    education: list,
                },
            }));
            get().saveToStorage();
        },

        // Add skill
        addSkill: (skill) => {
            const newSkill: Skill = {
                id: nanoid(),
                ...skill,
            };
            set((state) => ({
                cvData: {
                    ...state.cvData,
                    skills: [...state.cvData.skills, newSkill],
                },
            }));
            get().saveToStorage();
        },

        // Remove skill
        removeSkill: (id) => {
            set((state) => ({
                cvData: {
                    ...state.cvData,
                    skills: state.cvData.skills.filter((skill) => skill.id !== id),
                },
            }));
            get().saveToStorage();
        },

        // Wizard navigation
        setCurrentStep: (step) => set({ currentStep: step }),

        nextStep: () => {
            const { currentStep } = get();
            const currentIndex = WIZARD_STEPS.indexOf(currentStep);
            if (currentIndex < WIZARD_STEPS.length - 1) {
                set({ currentStep: WIZARD_STEPS[currentIndex + 1] });
            }
        },

        prevStep: () => {
            const { currentStep } = get();
            const currentIndex = WIZARD_STEPS.indexOf(currentStep);
            if (currentIndex > 0) {
                set({ currentStep: WIZARD_STEPS[currentIndex - 1] });
            }
        },

        // Load from localStorage
        loadFromStorage: () => {
            set({ isLoading: true });
            const data = loadCV();
            set({ cvData: data, isLoading: false });
        },

        // Save to localStorage (debounced in real usage)
        saveToStorage: () => {
            const { cvData } = get();
            set({ isSaving: true });
            saveCV(cvData);
            set({ isSaving: false });
        },

        // Reset CV to defaults
        resetCV: () => {
            set({ cvData: defaultCVData, currentStep: 'personal' });
            get().saveToStorage();
        },
    }))
);
