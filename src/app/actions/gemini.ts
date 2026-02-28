'use server';

import { GoogleGenAI, Type } from '@google/genai';

export async function analyzeDocumentAction(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { error: 'No file provided' };
        }

        // Convert the file to base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        const mimeType = file.type || 'application/pdf'; // fallback to pdf if unknown

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const prompt = `
        Analyze the provided architectural / engineering project document.
        Extract the following case study information and format it exactly according to the requested JSON schema.
        If a specific detail is not mentioned, provide an educated guess based on the context, or leave it blank if impossible to guess. Make the descriptions highly technical, professional, and concise (1-3 sentences per field).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                prompt,
                {
                    inlineData: {
                        mimeType,
                        data: base64Data
                    }
                }
            ],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        shortDescription: { type: Type.STRING },
                        location: { type: Type.STRING },
                        contextual: { type: Type.STRING },
                        sustainability: { type: Type.STRING },
                        regulatory: { type: Type.STRING },
                        budget: { type: Type.STRING },
                        formal: { type: Type.STRING },
                        materiality: { type: Type.STRING },
                        programming: { type: Type.STRING },
                        acoustics: { type: Type.STRING },
                        foundation: { type: Type.STRING },
                        lateral: { type: Type.STRING },
                        grid: { type: Type.STRING },
                        material: { type: Type.STRING },
                        hvac: { type: Type.STRING },
                        ventilation: { type: Type.STRING },
                        water: { type: Type.STRING },
                        power: { type: Type.STRING },
                        renewable: { type: Type.STRING },
                        automation: { type: Type.STRING },
                    }
                }
            }
        });

        const resultText = response.text;
        if (!resultText) throw new Error("No response from AI");

        return { data: JSON.parse(resultText) };

    } catch (error: any) {
        console.error('AI Analysis error:', error);
        return { error: error.message || 'Failed to analyze document' };
    }
}
