"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Book, listBooks } from "@/lib/api";

const statusLabels = {
  want_to_read: "Want to read",
  reading: "Reading",
  read: "Read",
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listBooks()
      .then(setBooks)
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load books.",
        ),
      )
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-4xl font-bold text-stone-950">Books</h1>
          <p className="mt-2 text-stone-700">
            A database-backed reading list served by FastAPI.
          </p>
        </div>
        <Link
          href="/books/new"
          className="w-fit rounded-md bg-emerald-700 px-4 py-2 font-semibold text-white transition hover:bg-emerald-800"
        >
          Add Book
        </Link>
      </div>

      {isLoading ? (
        <p className="rounded-md border border-stone-200 bg-white p-5 text-stone-700">
          Loading books...
        </p>
      ) : null}

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </p>
      ) : null}

      {!isLoading && !error && books.length === 0 ? (
        <div className="rounded-md border border-stone-200 bg-white p-6">
          <p className="text-stone-700">No books yet. Add one to begin.</p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            className="rounded-md border border-stone-200 bg-white p-5 shadow-sm transition hover:border-emerald-600"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-950">{book.title}</h2>
                <p className="mt-1 text-stone-600">by {book.author}</p>
              </div>
              <span className="rounded-md bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-700">
                {statusLabels[book.status]}
              </span>
            </div>
            {book.rating ? (
              <p className="mt-4 text-sm font-semibold text-emerald-800">
                Rating: {book.rating}/5
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </main>
  );
}
