import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import pdf from 'pdf-parse';
import connectDB from '@/config/database';
import Analysis from '@/models/Analysis';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI SDK with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callGeminiAPI(prompt) {
  try {
    // Get the generative model, passing in the generation config
    const model = genAI.getGenerativeModel({
      model: "gemini-pro", // Using the standard, stable model
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Re-throw the error to be caught by the main handler
    throw new Error("Gemini API call failed.");
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const formData = await request.formData();
    const resumeFile = formData.get('resume');
    const jobDescription = formData.get('jobDescription');

    if (!resumeFile) {
      return new NextResponse(JSON.stringify({ message: 'Resume file is required' }), { status: 400 });
    }

    const fileBuffer = await resumeFile.arrayBuffer();
    const pdfData = await pdf(fileBuffer);
    const resumeText = pdfData.text;

    let prompt;
    if (jobDescription) {
      prompt = `You are an expert HR analyst. Compare the following resume against the provided job description. Provide ONLY a JSON object with the exact structure: { "matchScore": number, "summary": "string", "matchingKeywords": ["string"], "missingKeywords": ["string"] }. --- RESUME TEXT: ${resumeText} --- JOB DESCRIPTION: ${jobDescription}`;
    } else {
      prompt = `You are an expert HR analyst reviewing a resume for IT roles. Provide ONLY a JSON object with the exact structure: { "atsScore": number, "strengths": "string", "areasForImprovement": "string" }. --- RESUME TEXT: ${resumeText}`;
    }

    const geminiResponseText = await callGeminiAPI(prompt);
    const analysisResult = JSON.parse(geminiResponseText);

    await connectDB();
    const newAnalysis = new Analysis({
      user: session.user.id,
      fileName: resumeFile.name,
      resumeText: resumeText,
      analysisResult: analysisResult,
    });
    await newAnalysis.save();

    return new NextResponse(JSON.stringify(analysisResult), { status: 200 });

  } catch (error) {
    console.error('Error in analyze API:', error.message);
    // Send back a more specific error if it's from our Gemini call
    if (error.message === "Gemini API call failed.") {
        return new NextResponse(JSON.stringify({ message: 'Could not get a response from the AI. Please check your API key and Google Cloud project setup.' }), { status: 500 });
    }
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}