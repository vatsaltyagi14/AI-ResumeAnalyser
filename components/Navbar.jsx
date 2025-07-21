'use client';
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const profileImage = session?.user?.image;

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold bg-black text-transparent bg-clip-text"
        >
          Resumify
        </Link>
        <div>
          {status === 'loading' ? (
            // loading gng
            <div className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse"></div>
          ) : status === 'authenticated' ? (
            // if the user is logged in
            <div className="flex items-center gap-4">
              <button
                onClick={() => signOut()}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Sign Out
              </button>
              <Link href="/dashboard">
                <Image
                  src={profileImage}
                  alt="Profile Image"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </Link>
            </div>
          ) : (
            // Show this if the user is not logged in
            <button
              onClick={() => signIn('google')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
