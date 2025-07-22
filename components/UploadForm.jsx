'use client';
import { useState } from 'react';
import * as pdfjs from 'pdfjs-dist';

// zaroori line h iske liye
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const UploadForm = () => {
  const [file, setFile] = useState(null); // ye raw pdf hold karta hai
  const [fileName, setFileName] = useState(''); 
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // Helper function to extract text from PDF
  const getTextFromPdf = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        try {
          const typedArray = new Uint8Array(event.target.result);
          const pdf = await pdfjs.getDocument(typedArray).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ');
          }
          resolve(text);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a resume file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // 1. Parse PDF on the client
      const resumeText = await getTextFromPdf(file);

      // 2. Send the extracted text to the API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: fileName,
          resumeText: resumeText,
          jobDescription: jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setAnalysisResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="resume" className="block text-slate-700 font-bold mb-2">
              Upload Resume (PDF only)
            </label>
            <input
              type="file"
              id="resume"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-slate-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="jobDescription" className="block text-slate-700 font-bold mb-2">
              Job Description (Optional)
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here for a matching analysis..."
              className="w-full p-2 border border-slate-300 rounded h-40"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-400"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Analysis Results</h2>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {analysisResult && (
          <div className="space-y-4">
            {analysisResult.atsScore !== undefined && (
              <div>
                <h3 className="text-lg font-semibold">General Analysis</h3>
                <p><strong>ATS Score:</strong> {analysisResult.atsScore}/100</p>
                <p><strong>Strengths:</strong> {analysisResult.strengths}</p>
                <p><strong>Areas for Improvement:</strong> {analysisResult.areasForImprovement}</p>
              </div>
            )}
            {analysisResult.matchScore !== undefined && (
              <div>
                <h3 className="text-lg font-semibold">Job Match Analysis</h3>
                <p><strong>Match Score:</strong> {analysisResult.matchScore}/100</p>
                <p><strong>Summary:</strong> {analysisResult.summary}</p>
                <p><strong>Matching Keywords:</strong> {analysisResult.matchingKeywords.join(', ')}</p>
                <p><strong>Missing Keywords:</strong> {analysisResult.missingKeywords.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;