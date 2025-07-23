'use client';
import dynamic from 'next/dynamic'; //dynamic load keliye
import PastAnalyses from '@/components/PastAnalyses'; 

// Dynamically importuploadform ssr off hai toh client pe hoga, this was used for pdfjs to work as it requires bropwseronly apis
const UploadForm = dynamic(() => import('@/components/UploadForm'), {
  ssr: false,
  loading: () => <p>Loading form...</p>
});

const DashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
      <p className="text-slate-600 mb-8">Upload your resume to get started.</p>
      
      <UploadForm />

      <hr className="my-8" /> 

      <PastAnalyses />
    </div>
  );
};

export default DashboardPage;

