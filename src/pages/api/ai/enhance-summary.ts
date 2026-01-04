import type { APIRoute } from 'astro';
import { getGeminiModel } from '@/lib/gemini';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const { content, targetRole, language = 'id' } = await request.json();

        if (!content) {
            return new Response(JSON.stringify({ success: false, error: 'Content is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const model = getGeminiModel();

        const prompt = `
        Role: Professional Resume Writer / HR Specialist.
        Task: Enhance the following professional summary for a CV.
        Target Role: ${targetRole || 'Not specified'}
        Language: ${language === 'id' ? 'Indonesian' : 'English'}

        Instructions:
        1. Make it professional, concise, and impactful.
        2. Highlight key strengths and achievements if implied.
        3. Use strong action verbs.
        4. Keep it under 4-5 lines.
        5. Return ONLY the enhanced summary text, no explanations.

        Original Summary:
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
