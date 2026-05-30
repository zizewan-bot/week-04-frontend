import type { Metadata } from "next";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const serif = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["700"],
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Tracker",
  description: "A full stack book tracker built with Next.js and FastAPI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <header className="border-b border-stone-200 bg-[#f8f5ef]">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-serif text-xl font-bold text-stone-950">
              Book Tracker
            </Link>
            <div className="flex items-center gap-4 text-sm font-medium text-stone-700">
              <Link className="hover:text-emerald-700" href="/books">
                Books
              </Link>
              <Link className="hover:text-emerald-700" href="/books/new">
                Add Book
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
