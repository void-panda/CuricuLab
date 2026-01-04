// API client for AI enhancement features
// Calls Cloudflare Worker backend for Gemini integration OR local Gemini SDK if user key provided
import { getGeminiModel } from './gemini';

const API_BASE_URL = (typeof window !== 'undefined' && (window as any).__API_URL__) || '/api';

function hasUserKey() {
    return typeof window !== 'undefined' && !!sessionStorage.getItem('GEMINI_API_KEY');
}

/**
 * Enhance professional summary using AI
 */
export async function enhanceSummary(
    summary: string,
    targetRole: string,
    language: 'id' | 'en' = 'id'
): Promise<string> {
    if (hasUserKey()) {
        const model = getGeminiModel();
        const prompt = `Sebagai pakar penulisan CV, tingkatkan ringkasan profesional berikut untuk peran "${targetRole}" dalam bahasa ${language === 'id' ? 'Indonesia' : 'Inggris'}. 
        
ATURAN KETAT:
1. JANGAN menambah informasi, skill, atau pengalaman yang tidak ada di ringkasan asli.
2. Panjang maksimal adalah 50 kata atau 3 kalimat.
3. Gunakan nada profesional dan ringkas.
4. Berikan HANYA teks ringkasan yang sudah diperbaiki tanpa tambahan kata pengantar atau penjelasan.

Ringkasan asli:
${summary}`;

        const result = await model.generateContent(prompt);
        return result.response.text().trim().replace(/^["']|["']$/g, '');
    }

    const response = await fetch(`${API_BASE_URL}/ai/enhance-summary`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: summary,
            targetRole,
            language,
        }),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.result) {
        throw new Error(data.error || 'Failed to enhance summary');
    }

    return data.result;
}

/**
 * Enhance experience description using AI
 */
export async function enhanceExperience(
    description: string[],
    position: string,
    targetRole: string,
    language: 'id' | 'en' = 'id'
): Promise<string[]> {
    if (hasUserKey()) {
        const model = getGeminiModel();
        const prompt = `Sebagai pakar penulisan CV, tingkatkan poin-poin pengalaman kerja berikut untuk posisi "${position}" dengan target peran "${targetRole}" dalam bahasa ${language === 'id' ? 'Indonesia' : 'Inggris'}. 
        
ATURAN:
1. Gunakan action verbs yang kuat dan orientasi hasil.
2. JANGAN menambah fakta atau angka yang tidak ada di teks asli.
3. Tetap pertahankan jumlah poin sesuai aslinya.
4. Berikan hasil dalam bentuk baris teks saja, tanpa bullet point atau nomor. Satu baris per satu poin.

Poin-poin asli:
${description.join('\n')}
`;

        const result = await model.generateContent(prompt);
        return result.response.text().split('\n').filter(line => line.trim()).map(line => line.replace(/^[\s•\-\*]+/, ''));
    }

    const response = await fetch(`${API_BASE_URL}/ai/enhance-experience`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: description.join('\n'),
            targetRole,
            position,
            language,
        }),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.result) {
        throw new Error(data.error || 'Failed to enhance experience');
    }

    // Split result back into array of bullet points
    return data.result.split('\n').filter((line: string) => line.trim());
}

/**
 * Suggest skills based on target role using AI
 */
export async function suggestSkills(
    targetRole: string,
    currentSkills: string[],
    language: 'id' | 'en' = 'id'
): Promise<string[]> {
    if (hasUserKey()) {
        const model = getGeminiModel();
        const prompt = `Berikan rekomendasi 10-15 keahlian (skills) teknis dan soft skills yang paling relevan untuk peran "${targetRole}" dalam bahasa ${language === 'id' ? 'Indonesia' : 'Inggris'}. 
        
ATURAN:
1. Fokus pada keahlian yang umum dicari untuk peran tersebut.
2. Berikan hasil HANYA berupa daftar kata/frasa yang dipisahkan oleh koma.
3. JANGAN berikan penjelasan atau pengantar.

Keahlian saat ini (jangan diulangi): ${currentSkills.join(', ')}`;

        const result = await model.generateContent(prompt);
        return result.response.text().split(/[,\n]/).map(s => s.trim().replace(/^[\s•\-\*]+/, '')).filter(s => s && !currentSkills.includes(s));
    }

    const response = await fetch(`${API_BASE_URL}/ai/suggest-skills`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            targetRole,
            currentSkills,
            language,
        }),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.skills) {
        throw new Error(data.error || 'Failed to suggest skills');
    }

    return data.skills;
}

/**
 * Check if AI API is available
 */
export async function checkAIHealth(): Promise<boolean> {
    if (hasUserKey()) return true;
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
}
