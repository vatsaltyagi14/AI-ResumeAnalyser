'use client'; // React hooks use krenge isme
import Link from "next/link";
import { useState } from "react"; // We will use this later for mobile menus

const Navbar = () => {
  //will add useSession hook here later to get auth status
  const [isLoggedIn, setisLoggedIn] = useState(false);

  return (
    // Inspiration: Modern floating navbar with a blurred background
    <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-slate-900 text-2xl font-bold hover:text-purple-600 transition-colors"
        >
          Resumify
        </Link>
        <div>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/api/auth/signin" // nextauth pe chala jaega
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;