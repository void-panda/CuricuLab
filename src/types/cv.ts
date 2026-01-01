// CV Data Model Types
// Based on PRD requirements for AI-Powered CV Builder

export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
    photo?: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string | null; // null = currently working
    description: string[];
    location?: string;
    isEnhanced?: boolean; // Track if AI-enhanced
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    description?: string;
}

export interface Skill {
    id: string;
    name: string;
    category: 'technical' | 'soft' | 'language';
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ExportOptions {
    margin: 'narrow' | 'normal' | 'wide';
    pageSize: 'a4' | 'letter';
    filenamePrefix: string;
}

export interface CVSettings {
    targetRole: string;
    language: 'id' | 'en';
    template: 'creative-ats-01' | 'creative-ats-02';
    exportOptions: ExportOptions;
}

export interface CVData {
    personal: PersonalInfo;
    summary: string;
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    settings: CVSettings;
    lastUpdated?: string;
}

// Default empty CV data
export const defaultCVData: CVData = {
    personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
    },
    summary: '',
    experiences: [],
    education: [],
    skills: [],
    settings: {
        targetRole: '',
        language: 'id',
        template: 'creative-ats-01',
        exportOptions: {
            margin: 'normal',
            pageSize: 'a4',
            filenamePrefix: 'CV',
        },
    },
};

// Wizard step type
export type WizardStep =
    | 'personal'
    | 'summary'
    | 'experience'
    | 'education'
    | 'skills'
    | 'preview';

export const WIZARD_STEPS: WizardStep[] = [
    'personal',
    'summary',
    'experience',
    'education',
    'skills',
    'preview',
];

export const WIZARD_STEP_LABELS: Record<WizardStep, string> = {
    personal: 'Data Pribadi',
    summary: 'Ringkasan',
    experience: 'Pengalaman',
    education: 'Pendidikan',
    skills: 'Keahlian',
    preview: 'Preview',
};
