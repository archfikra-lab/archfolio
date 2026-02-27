import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// The Gemini API key should be set in .env.local as GEMINI_API_KEY
// Wait to initialize GoogleGenAI until the handler is called, so we can ensure process.env is read.
export async function POST(request: Request) {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const fileBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(fileBuffer).toString('base64');

        // Determine mime type
        const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');

        // System instructions for Fikra structure
        const prompt = `
    Analyze this architectural/engineering document and extract structured data.
    Format your response as a JSON array where each object has:
    1. 'project': { title, location, typology, year }
    2. 'disciplines': [{ type, contentJson }]
       - type must be "Architectural", "Structural", or "MEP".
       - contentJson must be a stringified object containing the technical details and specs for that discipline found in the document.
       
    Example:
    {
      "project": { "title": "The Tech Hub", "location": "Riyadh", "typology": "Commercial", "year": 2026 },
      "disciplines": [
        { "type": "Architectural", "contentJson": "{\"facade\": \"glass\", \"levels\": 5}" }
      ]
    }
    Only return valid JSON inside a code block, or raw JSON. Do not include markdown if possible.
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: mimeType
                            }
                        }
                    ]
                }
            ]
        });

        const outputText = response.text || '';

        // Clean up markdown markers if present
        const cleanedOutput = outputText.replace(/^```(json)?|```$/gm, '').trim();

        const parsedData = JSON.parse(cleanedOutput);

        // Ensure we have project and disciplines
        if (!parsedData.project || !parsedData.disciplines) {
            throw new Error("Invalid format returned from Gemini");
        }

        // Save to the database
        const newProject = await prisma.project.create({
            data: {
                title: parsedData.project.title || 'Untitled',
                location: parsedData.project.location || 'Unknown',
                typology: parsedData.project.typology || 'Mixed-Use',
                year: parseInt(parsedData.project.year) || new Date().getFullYear(),
                fikraVerificationStatus: 'Pending',
                disciplines: {
                    create: parsedData.disciplines.map((d: any) => ({
                        type: d.type || 'Architectural',
                        contentJson: typeof d.contentJson === 'string' ? d.contentJson : JSON.stringify(d.contentJson)
                    }))
                }
            },
            include: { disciplines: true }
        });

        return NextResponse.json({ success: true, data: newProject });

    } catch (error) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: 'Internal server error while processing document' }, { status: 500 });
    }
}
