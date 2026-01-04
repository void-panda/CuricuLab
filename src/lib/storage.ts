// LocalStorage utilities for CV data persistence
import type { CVData } from '@/types/cv';
import { defaultCVData } from '@/types/cv';

const STORAGE_KEY = 'curiculab_cv_data';
const STORAGE_VERSION = '1.0';

interface StorageWrapper {
    version: string;
    data: CVData;
    lastSaved: string;
}

/**
 * Save CV data to localStorage
 */
export function saveCV(data: CVData): void {
    try {
        const wrapper: StorageWrapper = {
            version: STORAGE_VERSION,
            data: {
                ...data,
                lastUpdated: new Date().toISOString(),
            },
            lastSaved: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wrapper));
    } catch (error) {
        console.error('Failed to save CV data:', error);
    }
}

/**
 * Load CV data from localStorage
 */
export function loadCV(): CVData {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return defaultCVData;
        }

        const wrapper: StorageWrapper = JSON.parse(stored);

        // Check if data is expired (24 hours)
        const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in ms
        const lastSavedDate = new Date(wrapper.lastSaved).getTime();
        const now = new Date().getTime();

        if (now - lastSavedDate > expirationTime) {
            console.warn('CV data expired (older than 24h), clearing storage');
            localStorage.removeItem(STORAGE_KEY);
            return defaultCVData;
        }

        // Version check for future migrations
        if (wrapper.version !== STORAGE_VERSION) {
            console.warn('CV data version mismatch, using defaults');
            return defaultCVData;
        }

        // Merge with defaults to ensure new fields are present
        return {
            ...defaultCVData,
            ...wrapper.data,
            settings: {
                ...defaultCVData.settings,
                ...wrapper.data.settings,
                exportOptions: {
                    ...defaultCVData.settings.exportOptions,
                    ...(wrapper.data.settings?.exportOptions || {}),
                },
            },
        };
    } catch (error) {
        console.error('Failed to load CV data:', error);
        return defaultCVData;
    }
}

/**
 * Clear CV data from localStorage
 */
export function clearCV(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear CV data:', error);
    }
}

/**
 * Export CV data as JSON string
 */
export function exportCVToJSON(data: CVData): string {
    return JSON.stringify(data, null, 2);
}

/**
 * Import CV data from JSON string
 */
export function importCVFromJSON(json: string): CVData | null {
    try {
        const data = JSON.parse(json) as CVData;
        // Basic validation
        if (!data.personal || !data.settings) {
            throw new Error('Invalid CV data structure');
        }
        return data;
    } catch (error) {
        console.error('Failed to import CV data:', error);
        return null;
    }
}

/**
 * Check if CV data exists in storage
 */
export function hasStoredCV(): boolean {
    try {
        return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
        return false;
    }
}

/**
 * Get last saved timestamp
 */
export function getLastSavedTime(): string | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const wrapper: StorageWrapper = JSON.parse(stored);
        return wrapper.lastSaved;
    } catch {
        return null;
    }
}
