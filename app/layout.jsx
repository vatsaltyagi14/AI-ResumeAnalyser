import { Inter } from "next/font/google"; //font load karne ke liye optimised tareeka
import "@/assets/styles/global.css";
import Navbar from "@/components/Navbar";
import Provider from "@/components/Provider";

const inter = Inter({ subsets: ["latin"] });

// SEO ke liye metadata 
export const metadata = {
  title: "AI Resume Analyser",
  description: "Analyse your resume with the power of AI",
  keywords: "resume, analyser, ai, nextjs, react,fullstack",
};

const Layout = function ({ children }) {
  return (
    <html>
      <body className={`${inter.className} bg-slate-50`}>
        <Provider>
          <Navbar />
          <main className="pt-20">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
 
export default  Layout ;
