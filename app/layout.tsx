import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nanoread - AI Webpage Summarizer",
  description: "Paste any URL and get a clean AI-powered summary instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var t = localStorage.getItem('theme');
              if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e){}
          })();
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}