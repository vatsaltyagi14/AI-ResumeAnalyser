# **Resumify \- AI Resume Analyser**

Resumify is a full-stack web application designed to help job seekers get instant, AI-powered feedback on their resumes. Users can upload their resume to receive a detailed analysis, an ATS (Applicant Tracking System) compatibility score, or compare it directly against a specific job description to identify keyword gaps and improve their chances of landing an interview.

## 🚀 Live Demo

You can view the live, deployed version of the project here:

[**https://ai-resume-analyser-delta.vercel.app/**](https://ai-resume-analyser-delta.vercel.app/)

## **Features**

* **Secure Google Authentication:** Users can sign in securely with their Google account using NextAuth.js.  
* **Dual Analysis Modes:**  
  * **General ATS Score:** Get a critical ATS score (0-100) based on a weighted rubric that evaluates formatting, keywords, and quantifiable metrics.  
  * **Job Description Matching:** Paste a job description to get a match score and a detailed breakdown of matching and missing keywords.  
* **AI-Powered Feedback:** Leverages the Google Gemini API to provide detailed, actionable feedback on a resume's strengths and areas for improvement.  
* **Persistent User Dashboard:** All analysis results are saved to a MongoDB database, allowing users to view their history.  
* **Modern, Responsive UI:** Built with Next.js and Tailwind CSS for a clean, fast, and mobile-friendly user experience.

## **Tech Stack**

* **Framework:** Next.js (App Router)  
* **Frontend:** React, Tailwind CSS  
* **Authentication:** NextAuth.js  
* **Database:** MongoDB with Mongoose  
* **AI:** Google Gemini API (@google/generative-ai)  
* **PDF Parsing:** pdfjs-dist (Client-Side)

## **Getting Started**

To get a local copy up and running, follow these simple steps.

### **Prerequisites**

* Node.js (v18 or later)  
* npm  
* A MongoDB Atlas account  
* A Google Cloud Platform account for OAuth credentials  
* A Google AI Studio account for a Gemini API key

### **Installation**

1. **Clone the repository:**  
   git clone https://github.com/your-username/resume-analyser.git  
   cd resume-analyser

2. **Install NPM packages:**  
   npm install

3. Set up Environment Variables:  
   Create a file named .env.local in the root of the project and add the following variables.  
   \# MongoDB Connection String (from MongoDB Atlas)  
   MONGODB\_URI=

   \# NextAuth Secret & URL  
   \# Generate a secret with: openssl rand \-base64 32  
   \# Or use an online generator: https://generate-secret.vercel.app/32  
   NEXTAUTH\_SECRET=  
   NEXTAUTH\_URL=http://localhost:3000

   \# Google OAuth Credentials (from Google Cloud Console)  
   GOOGLE\_CLIENT\_ID=  
   GOOGLE\_CLIENT\_SECRET=

   \# Google Gemini API Key (from Google AI Studio)  
   GEMINI\_API\_KEY=

4. **Run the development server:**  
   npm run dev

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.
