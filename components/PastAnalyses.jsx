'use client';
import { useState, useEffect } from 'react';

const PastAnalyses = () => {
  const [analyses, setAnalyses] = useState([]); //array jo rakhega pas analysis
  const [loading, setLoading] = useState(true); // vohi fetch karte wakt true hoga ye 
  const [visibleResumeId, setVisibleResumeId] = useState(null); // jo khula h uski id

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await fetch('/api/history'); //get call
        if (res.ok) {
          const data = await res.json();
          setAnalyses(data);
        }
      } catch (error) {
        console.error('Failed to fetch analyses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []); // ek hi baar chlega

  const toggleResumeVisibility = (id) => {
    if (visibleResumeId === id) {
      setVisibleResumeId(null); // Hide agaralready visible
    } else {
      setVisibleResumeId(id); // varna show
    }
  };

  if (loading) {
    return <p>Loading past analyses...</p>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Past Analyses</h2>
      {analyses.length === 0 ? ( // agar naya user h toh
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 text-center">
            <p className="text-slate-600">You have no past analyses yet. Perform your first analysis to see the results here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <div key={analysis._id} className="bg-white p-4 rounded-lg shadow-md border border-slate-200 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">{analysis.fileName}</h3>
                  <p className="text-sm text-slate-500 mb-2">
                    Analyzed on: {new Date(analysis.createdAt).toLocaleDateString()}
                  </p>
                  {analysis.analysisResult.atsScore !== undefined && (
                    <p className="font-medium text-slate-700"><strong>ATS Score:</strong> {analysis.analysisResult.atsScore}/100</p>
                  )}
                  {analysis.analysisResult.matchScore !== undefined && (
                    <p className="font-medium text-slate-700"><strong>Match Score:</strong> {analysis.analysisResult.matchScore}/100</p>
                  )}
                </div>
                <button
                  onClick={() => toggleResumeVisibility(analysis._id)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  {visibleResumeId === analysis._id ? 'Hide Resume' : 'Show Resume'}
                </button>
              </div>
              {visibleResumeId === analysis._id && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="font-semibold mb-2 text-slate-700">Resume Text Analyzed:</h4>
                  <pre className="bg-slate-50 p-4 rounded-md text-sm whitespace-pre-wrap font-sans max-h-80 overflow-y-auto text-slate-600 leading-relaxed">
                    {analysis.resumeText}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastAnalyses;
