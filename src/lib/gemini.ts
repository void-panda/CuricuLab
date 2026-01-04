import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = (import.meta as any).env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiModel() {
    // Priority: 1. sessionStorage (User provided) 2. env (Default)
    const userKey = typeof window !== 'undefined' ? sessionStorage.getItem('GEMINI_API_KEY') : null;
    const keyToUse = userKey || API_KEY;

    if (!keyToUse) {
        throw new Error('Gemini API Key is not set. Please provide one in settings.');
    }

    if (!genAI || (userKey && keyToUse !== (genAI as any).apiKey)) {
        genAI = new GoogleGenerativeAI(keyToUse);
    }

    return genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
}
