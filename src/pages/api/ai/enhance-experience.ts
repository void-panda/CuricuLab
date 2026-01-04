import type { APIRoute } from 'astro';
import { getGeminiModel } from '@/lib/gemini';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const { content, position, targetRole, language = 'id' } = await request.json();

        if (!content) {
            return new Response(JSON.stringify({ success: false, error: 'Content is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const model = getGeminiModel();

        const prompt = `
        Role: Professional Resume Writer / HR Specialist.
        Task: Enhance the following job experience description for a CV.
        Position: ${position || 'Not specified'}
        Refined for Target Role: ${targetRole || 'Not specified'}
        Language: ${language === 'id' ? 'Indonesian' : 'English'}

        Instructions:
        1. Improve clarity, impact, and professionalism.
        2. Convert to bullet points (start with -).
        3. Quantify achievements where possible (add placeholders like [X]% if needed, but preferably enhance existing numbers).
        4. Use strong action verbs.
        5. Return ONLY the bullet points, separated by newlines. No intro/outro.

        Original Description:
        "${content}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return new Response(JSON.stringify({ success: true, result: text.trim() }), {
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
