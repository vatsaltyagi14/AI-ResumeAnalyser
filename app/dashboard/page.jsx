'use client'; 
import dynamic from 'next/dynamic';

// Dynamically importign uploadform cos usme pdfjs  hai that needs to be after the browser is rendered
const UploadForm = dynamic(() => import('@/components/UploadForm'), {
  ssr: false,
  loading: () => <p>Loading form...</p> // Optional loading state
});

const DashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
      <p className="text-slate-600 mb-8">Upload your resume to get started.</p>
      
      <UploadForm />
    </div>
  );
};

export default DashboardPage;
