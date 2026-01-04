import type { APIRoute } from 'astro';
import { getGeminiModel } from '@/lib/gemini';
import mammoth from 'mammoth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { text, fileData, fileName } = await request.json();

    if (!text && !fileData) {
      return new Response(JSON.stringify({ success: false, error: 'Text or file data is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let extractedText = text || '';

    // If it's a DOCX file, extract text on the server using mammoth
    if (fileData && fileData.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const buffer = Buffer.from(fileData.base64, 'base64');
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    }

    const model = getGeminiModel();

    const prompt = `
        Role: Expert ATS Resume Parser & Data Extraction Specialist.
        Task: Extract structured information from the provided CV into a JSON format that matches the application's data model.

        Target JSON Schema:
        {
          "personal": {
            "fullName": "Full name",
            "email": "Email address",
            "phone": "Phone number",
            "location": "City, Country",
            "linkedin": "LinkedIn profile URL (optional)",
            "portfolio": "Portfolio/Website URL (optional)"
          },
          "summary": "Professional summary paragraph",
          "experiences": [
            {
              "company": "Company Name",
              "position": "Job Title",
              "startDate": "YYYY-MM",
              "endDate": "YYYY-MM or null if present",
              "location": "Location",
              "description": ["Bullet point 1", "Bullet point 2"]
            }
          ],
          "education": [
            {
              "institution": "University Name",
              "degree": "Degree Name",
              "field": "Field of Study",
              "startDate": "YYYY-MM",
              "endDate": "YYYY-MM",
              "gpa": "GPA (optional)"
            }
          ],
          "skills": [
            { "name": "Skill Name", "category": "technical" | "soft" | "language" }
          ],
          "certifications": [
            { "name": "Certification Name", "issuer": "Issuer", "date": "YYYY-MM", "url": "URL (optional)", "description": "Description (optional)" }
          ]
        }

        Instructions:
        1. Accuracy is critical. Map data to the correct fields.
        2. Convert all dates to YYYY-MM format if possible, otherwise use original string.
        3. For 'experiences.description', extract bullet points as a list of strings.
        4. Categorize skills correctly into 'technical', 'soft', or 'language'.
        5. If a section is missing, return an empty array [] or empty string "".
        6. Return ONLY the JSON object. Do NOT include markdown code blocks or explanations.

        CV Content to Parse (Filename: ${fileName}):
        `;

    const contents: any[] = [prompt];

    if (fileData && fileData.mimeType === 'application/pdf') {
      contents.push({
        inlineData: {
          data: fileData.base64,
          mimeType: fileData.mimeType
        }
      });
    } else {
      contents.push(`Extracted CV Content:\n"""\n${extractedText}\n"""`);
    }

    const result = await model.generateContent(contents);
    const response = await result.response;
    const resultText = response.text().trim();

    // Clean potentially returned markdown blocks
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : resultText;

    try {
      const parsedJson = JSON.parse(jsonString);
      return new Response(JSON.stringify(parsedJson), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Raw Text:', resultText);
      return new Response(JSON.stringify({ success: false, error: 'AI returned invalid JSON format' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
