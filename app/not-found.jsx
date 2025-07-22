import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <section className="text-center flex flex-col justify-center items-center h-96">
      <AlertTriangle className="text-yellow-400 text-6xl mb-4" size={48} />
      <h1 className="text-4xl font-bold mb-4">404 Not Found</h1>
      <p className="text-xl mb-5">This page does not exist</p>
      <Link
        href="/"
        className="text-white bg-purple-600 hover:bg-purple-800 rounded-md px-3 py-2 mt-4"
      >
        Go Back
      </Link>
    </section>
  );
};

export default NotFoundPage;