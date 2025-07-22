import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/config/database';
import Analysis from '@/models/Analysis';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI SDK with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    // 1. Get the text data from the client
    const { fileName, resumeText, jobDescription } = await request.json();

    if (!resumeText) {
      return new NextResponse(JSON.stringify({ message: 'Resume text is required' }), { status: 400 });
    }

    // 2. Construct prompt (no parsing needed)
    let prompt;
    if (jobDescription) {
      prompt = `You are an expert HR analyst. Compare the following resume against the provided job description. Provide ONLY a JSON object with the exact structure: { "matchScore": number, "summary": "string", "matchingKeywords": ["string"], "missingKeywords": ["string"] }. --- RESUME TEXT: ${resumeText} --- JOB DESCRIPTION: ${jobDescription}`;
    } else {
      prompt = `You are an expert HR analyst reviewing a resume for IT roles. Provide ONLY a JSON object with the exact structure: { "atsScore": number, "strengths": "string", "areasForImprovement": "string" }. --- RESUME TEXT: ${resumeText}`;
    }

    // 3. Call Gemini API
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const geminiResponseText = response.text();
    const analysisResult = JSON.parse(geminiResponseText);

    // 4. Save to Database
    await connectDB();
    const newAnalysis = new Analysis({
      user: session.user.id,
      fileName: fileName,
      resumeText: resumeText,
      analysisResult: analysisResult,
    });
    await newAnalysis.save();

    return new NextResponse(JSON.stringify(analysisResult), { status: 200 });

  } catch (error) {
    console.error('Error in analyze API:', error);
    return new NextResponse(JSON.stringify({ message: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
