import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/config/database';
import Analysis from '@/models/Analysis';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { fileName, resumeText, jobDescription } = await request.json();

    if (!resumeText) {
      return new NextResponse(JSON.stringify({ message: 'Resume text is required' }), { status: 400 });
    }

    let prompt;
    if (jobDescription) {
      prompt = `You are a strict and meticulous HR analyst. Your task is to perform a direct, keyword-based comparison of the provided resume against the job description. Be critical. Provide ONLY a JSON object with the exact structure: { "matchScore": number (0-100, based on keyword overlap and experience relevance), "summary": "A concise, two-sentence verdict on the candidate's fit for the role.", "matchingKeywords": ["An array of important keywords found in both the resume and the job description"], "missingKeywords": ["An array of important keywords from the job description that are MISSING from the resume"] }. --- RESUME TEXT: ${resumeText} --- JOB DESCRIPTION: ${jobDescription}`;

    } else {
      prompt = `You are a strict, modern Applicant Tracking System (ATS) simulator. Your task is to analyze the provided resume text and calculate an ATS-friendliness score based on a weighted rubric. Be highly critical and do not give points easily.

      Scoring Rubric (Total 100 points):
      1.  **Formatting & Parsability (25 points):** Does the resume use standard sections like "Education", "Experience", "Skills"? Is the layout simple and easy for a machine to read? Penalize heavily for columns, tables, or overly complex designs.
      2.  **Keywords & Skills (35 points):** How many relevant IT keywords (languages, frameworks, tools) are present? Award points based on the quantity and relevance of technical skills listed.
      3.  **Action Verbs & Quantifiable Metrics (30 points):** Does the experience section use strong action verbs (e.g., "Engineered", "Developed", "Managed")? Are there quantifiable achievements (e.g., "increased accuracy by 25%", "reduced latency by 50ms")? Award points for each clear metric.
      4.  **Conciseness & Relevance (10 points):** Is the resume concise and to the point? Is the information relevant for a tech role?

      Calculate the score based ONLY on the rubric above. Provide ONLY a JSON object with the exact structure: { "atsScore": number (the final calculated score from 0-100), "strengths": "A paragraph highlighting what makes this resume ATS-friendly based on the rubric.", "areasForImprovement": "A paragraph suggesting specific changes to improve the ATS score, focusing on formatting, keywords, and adding metrics." }. --- RESUME TEXT: ${resumeText}`;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const geminiResponseText = response.text();
    const analysisResult = JSON.parse(geminiResponseText);

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