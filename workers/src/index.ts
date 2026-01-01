// Cloudflare Worker - AI Proxy for Gemini API
// Handles CV enhancement requests securely without exposing API key

interface Env {
    GEMINI_API_KEY: string;
    ENVIRONMENT: string;
}

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// Rate limiting map (in production, use Cloudflare KV or Durable Objects)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in ms

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (record.count >= RATE_LIMIT) {
        return false;
    }

    record.count++;
    return true;
}

// Gemini API call
async function callGemini(
    apiKey: string,
    prompt: string
): Promise<string> {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
            }),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as any;
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// Prompt templates
const PROMPTS = {
    enhanceSummary: (summary: string, targetRole: string, language: string) => `
Kamu adalah seorang expert resume writer. Tulis ulang ringkasan profesional berikut agar lebih menarik dan ATS-friendly.

Ringkasan saat ini:
${summary}

Target posisi: ${targetRole || 'tidak disebutkan'}
Bahasa: ${language === 'id' ? 'Indonesia' : 'English'}

Aturan:
- Gunakan bahasa yang profesional dan aktif
- Fokus pada pencapaian dan value yang bisa diberikan
- Maksimal 3-4 kalimat
- Sertakan keywords yang relevan dengan posisi
- JANGAN tambahkan penjelasan, langsung tulis ringkasannya saja

Ringkasan yang ditingkatkan:`,

    enhanceExperience: (description: string, position: string, targetRole: string, language: string) => `
Kamu adalah seorang expert resume writer. Tulis ulang deskripsi pengalaman kerja berikut agar lebih profesional dan ATS-friendly.

Posisi: ${position}
Target posisi yang dilamar: ${targetRole || 'tidak disebutkan'}

Deskripsi saat ini:
${description}

Bahasa: ${language === 'id' ? 'Indonesia' : 'English'}

Aturan:
- Gunakan format bullet points (setiap baris diawali dengan -)
- Gunakan action verbs di awal setiap bullet
- Fokus pada pencapaian dan dampak yang terukur
- Sertakan angka/metrik jika memungkinkan
- Maksimal 4-5 bullet points
- JANGAN tambahkan penjelasan, langsung tulis bullet pointsnya saja

Deskripsi yang ditingkatkan:`,

    suggestSkills: (targetRole: string, currentSkills: string[], language: string) => `
Kamu adalah seorang career advisor. Berikan rekomendasi skill yang relevan untuk posisi berikut.

Target posisi: ${targetRole}
Skill yang sudah dimiliki: ${currentSkills.join(', ') || 'belum ada'}

Bahasa: ${language === 'id' ? 'Indonesia' : 'English'}

Aturan:
- Berikan 5-8 skill yang paling relevan dan sering dicari
- Jangan ulangi skill yang sudah dimiliki
- Fokus pada hard skills dan technical skills
- Format: satu skill per baris, tanpa numbering atau bullet
- JANGAN tambahkan penjelasan, langsung tulis nama skillnya saja

Rekomendasi skill:`,
};

// Request handlers
async function handleEnhanceSummary(request: Request, env: Env): Promise<Response> {
    const body = await request.json() as any;
    const { content, targetRole, language } = body;

    if (!content) {
        return new Response(
            JSON.stringify({ success: false, error: 'Content is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    const prompt = PROMPTS.enhanceSummary(content, targetRole || '', language || 'id');
    const result = await callGemini(env.GEMINI_API_KEY, prompt);

    return new Response(
        JSON.stringify({ success: true, result: result.trim() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
}

async function handleEnhanceExperience(request: Request, env: Env): Promise<Response> {
    const body = await request.json() as any;
    const { content, position, targetRole, language } = body;

    if (!content) {
        return new Response(
            JSON.stringify({ success: false, error: 'Content is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    const prompt = PROMPTS.enhanceExperience(content, position || '', targetRole || '', language || 'id');
    const result = await callGemini(env.GEMINI_API_KEY, prompt);

    return new Response(
        JSON.stringify({ success: true, result: result.trim() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
}

async function handleSuggestSkills(request: Request, env: Env): Promise<Response> {
    const body = await request.json() as any;
    const { targetRole, currentSkills, language } = body;

    if (!targetRole) {
        return new Response(
            JSON.stringify({ success: false, error: 'Target role is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    const prompt = PROMPTS.suggestSkills(targetRole, currentSkills || [], language || 'id');
    const result = await callGemini(env.GEMINI_API_KEY, prompt);

    // Parse skills from response
    const skills = result
        .split('\n')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0 && !s.startsWith('-'));

    return new Response(
        JSON.stringify({ success: true, skills }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
}

// Main handler
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        // Rate limiting
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        if (!checkRateLimit(clientIP)) {
            return new Response(
                JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
                { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Health check
        if (path === '/api/health' || path === '/health') {
            return new Response(
                JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // API routes
        try {
            if (request.method !== 'POST') {
                return new Response(
                    JSON.stringify({ success: false, error: 'Method not allowed' }),
                    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            if (path === '/api/ai/enhance-summary') {
                return await handleEnhanceSummary(request, env);
            }

            if (path === '/api/ai/enhance-experience') {
                return await handleEnhanceExperience(request, env);
            }

            if (path === '/api/ai/suggest-skills') {
                return await handleSuggestSkills(request, env);
            }

            return new Response(
                JSON.stringify({ success: false, error: 'Not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        } catch (error) {
            console.error('Error:', error);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: error instanceof Error ? error.message : 'Internal server error'
                }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }
    },
};
