import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiModel() {
    if (!API_KEY) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    if (!genAI) {
        genAI = new GoogleGenerativeAI(API_KEY);
    }

    return genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
}
