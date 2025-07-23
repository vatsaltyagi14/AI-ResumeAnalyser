'use client';
import { useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Upload, FileText } from 'lucide-react';

// pdfjs keliye zaroori h ye
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const UploadForm = () => {
  const [file, setFile] = useState(null); //stores raw file
  const [fileName, setFileName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false); //fetch hote hue wait krte h jab 
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; //takes the first file and updates file and filename
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };


  const getTextFromPdf = async (file) => {
    const reader = new FileReader(); //file reader browser ka scene hota hai, async treeke se reads files 
    return new Promise((resolve, reject) => { //thatsy promise cos async
      reader.onload = async (event) => {
        try {
          const typedArray = new Uint8Array(event.target.result); //pdf ko bin (array of 8bit unsigned ints rakhta h ye)
          const pdf = await pdfjs.getDocument(typedArray).promise; //parse krna
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
    e.preventDefault(); //stops page from reloading
    if (!file) {
      setError('Please select a resume file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const resumeText = await getTextFromPdf(file);

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
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="resume" className="block text-slate-700 font-bold mb-2">
              Upload Resume (PDF only)
            </label>
            <label
              htmlFor="resume-upload"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50"
            >
              {fileName ? (
                <>
                  <FileText className="text-purple-600 mr-2" />
                  <span className="text-slate-700 font-medium truncate">{fileName}</span>
                </>
              ) : (
                <>
                  <Upload className="text-slate-500 mr-2" />
                  <span className="text-slate-500">Select a PDF to Analyze</span>
                </>
              )}
            </label>
            <input
              type="file"
              id="resume-upload"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="jobDescription" className="block text-slate-700 font-bold mb-2">
              Job Description (Optional)
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here for a matching analysis..."
              className="w-full p-3 border border-slate-300 rounded-lg h-48 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-slate-400 transition-all duration-300"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Analysis Results</h2>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {analysisResult && (
          <div className="prose max-w-none">
            {analysisResult.atsScore !== undefined && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-700">General Analysis</h3>
                  <p className="text-5xl font-bold text-purple-600">{analysisResult.atsScore}<span className="text-3xl text-slate-500">/100</span></p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-800">Strengths:</h4>
                    <p>{analysisResult.strengths}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Areas for Improvement:</h4>
                    <p>{analysisResult.areasForImprovement}</p>
                  </div>
                </div>
              </>
            )}
            {analysisResult.matchScore !== undefined && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-700">Job Match Analysis</h3>
                  <p className="text-5xl font-bold text-purple-600">{analysisResult.matchScore}<span className="text-3xl text-slate-500">/100</span></p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-800">Summary:</h4>
                    <p>{analysisResult.summary}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Matching Keywords:</h4>
                    <p>{analysisResult.matchingKeywords.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Missing Keywords:</h4>
                    <p>{analysisResult.missingKeywords.join(', ')}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;