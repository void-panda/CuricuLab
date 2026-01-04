import type { APIRoute } from 'astro';
import { getGeminiModel } from '@/lib/gemini';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const { targetRole, currentSkills, language = 'id' } = await request.json();

        if (!targetRole) {
            return new Response(JSON.stringify({ success: false, error: 'Target role is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const model = getGeminiModel();

        const prompt = `
        Role: Professional Recruiter / HR Specialist.
        Task: Suggest relevant technical and soft skills for a given role, avoiding duplicates.
        Target Role: ${targetRole}
        Current Skills: ${currentSkills?.join(', ') || 'None'}
        Language: ${language === 'id' ? 'Indonesian' : 'English'}

        Instructions:
        1. Suggest highly relevant skills for the target role that are missing from Current Skills.
        2. Mix of technical and soft skills.
        3. Return a JSON array of strings ONLY. Example: ["Skill A", "Skill B", "Skill C"]
        4. Maximum 10 suggestions.

        Response Format: JSON Array only.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Clean up markdown code blocks if present
        if (text.startsWith('```json')) {
            text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (text.startsWith('```')) {
            text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        let skills: string[] = [];
        try {
            skills = JSON.parse(text);
        } catch {
            // Fallback if not valid JSON, split by newlines/commas
            skills = text.split(/[\n,]/).map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
        }

        return new Response(JSON.stringify({ success: true, skills }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Failed to process request'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
