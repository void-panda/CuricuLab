// API client for AI enhancement features
// Calls Cloudflare Worker backend for Gemini integration

const API_BASE_URL = (typeof window !== 'undefined' && (window as any).__API_URL__) || '/api';

interface AIEnhanceRequest {
    content: string;
    targetRole?: string;
    language?: 'id' | 'en';
}

interface AIEnhanceResponse {
    success: boolean;
    result?: string;
    error?: string;
}

interface AISuggestSkillsRequest {
    targetRole: string;
    currentSkills: string[];
    language?: 'id' | 'en';
}

interface AISuggestSkillsResponse {
    success: boolean;
    skills?: string[];
    error?: string;
}

/**
 * Enhance professional summary using AI
 */
export async function enhanceSummary(
    summary: string,
    targetRole: string,
    language: 'id' | 'en' = 'id'
): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/ai/enhance-summary`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: summary,
            targetRole,
            language,
        } as AIEnhanceRequest),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data: AIEnhanceResponse = await response.json();

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
    const response = await fetch(`${API_BASE_URL}/ai/suggest-skills`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            targetRole,
            currentSkills,
            language,
        } as AISuggestSkillsRequest),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data: AISuggestSkillsResponse = await response.json();

    if (!data.success || !data.skills) {
        throw new Error(data.error || 'Failed to suggest skills');
    }

    return data.skills;
}

/**
 * Check if AI API is available
 */
export async function checkAIHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
}
