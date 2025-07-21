import Link from "next/link";
import { CheckCircle, BarChart, FileText } from "lucide-react";

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="text-slate-900 text-center py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              Unlock Your Career Potential
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Get instant, AI-powered feedback on your resume. Check your ATS score or match it against a job description to land your dream job.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Analyse Your Resume
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">Why Choose Resumify?</h2>
            <p className="text-slate-500 mt-2">The ultimate tool to get you interview-ready.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 border border-slate-200 rounded-lg shadow-sm">
              <div className="flex justify-center items-center mb-4 w-12 h-12 bg-purple-100 text-purple-600 rounded-full mx-auto">
                <BarChart size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">ATS Score Checker</h3>
              <p className="text-slate-500">
                See how your resume scores against Applicant Tracking Systems used by top companies.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="text-center p-6 border border-slate-200 rounded-lg shadow-sm">
              <div className="flex justify-center items-center mb-4 w-12 h-12 bg-purple-100 text-purple-600 rounded-full mx-auto">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Description Matching</h3>
              <p className="text-slate-500">
                Compare your resume against a specific job description to identify keyword gaps.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="text-center p-6 border border-slate-200 rounded-lg shadow-sm">
              <div className="flex justify-center items-center mb-4 w-12 h-12 bg-purple-100 text-purple-600 rounded-full mx-auto">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Feedback</h3>
              <p className="text-slate-500">
                Receive actionable insights and suggestions to improve your resume's content and format.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;