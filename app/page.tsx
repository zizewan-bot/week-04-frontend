import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-65px)] max-w-5xl content-center gap-8 px-6 py-16">
      <section className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-800">
          Week 4 Full Stack Lab
        </p>
        <h1 className="font-serif text-5xl font-bold leading-tight text-stone-950 sm:text-6xl">
          Track every book from first plan to final rating.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
          This Book Tracker connects a Next.js frontend to a FastAPI backend
          with PostgreSQL persistence. Add books, update reading progress, and
          remove finished test records from one clean workflow.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/books"
          className="rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
        >
          View Books
        </Link>
        <Link
          href="/books/new"
          className="rounded-md border border-stone-300 bg-white px-5 py-3 font-semibold text-stone-900 transition hover:border-emerald-700 hover:text-emerald-800"
        >
          Add a Book
        </Link>
      </div>
    </main>
  );
}
