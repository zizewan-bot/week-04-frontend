"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookForm } from "@/components/BookForm";
import { Book, BookInput, deleteBook, getBook, updateBook } from "@/lib/api";

export default function BookDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBook(params.id)
      .then(setBook)
      .catch((loadError) =>
        setError(
          loadError instanceof Error ? loadError.message : "Could not load book.",
        ),
      )
      .finally(() => setIsLoading(false));
  }, [params.id]);

  async function handleUpdate(updates: BookInput) {
    const updatedBook = await updateBook(params.id, updates);
    setBook(updatedBook);
  }

  async function handleDelete() {
    setIsDeleting(true);
    setError("");

    try {
      await deleteBook(params.id);
      router.push("/books");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete book.",
      );
      setIsDeleting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/books" className="text-sm font-semibold text-emerald-800">
        Back to books
      </Link>

      {isLoading ? (
        <p className="mt-8 rounded-md border border-stone-200 bg-white p-5 text-stone-700">
          Loading book...
        </p>
      ) : null}

      {error ? (
        <p className="mt-8 rounded-md border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </p>
      ) : null}

      {book ? (
        <>
          <div className="mt-6">
            <h1 className="font-serif text-4xl font-bold text-stone-950">
              {book.title}
            </h1>
            <p className="mt-2 text-stone-700">by {book.author}</p>
          </div>

          <section className="mt-8 rounded-md border border-stone-200 bg-white p-6 shadow-sm">
            <BookForm
              key={book.id}
              initialBook={book}
              submitLabel="Update Book"
              onSubmit={handleUpdate}
            />
          </section>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="mt-6 rounded-md border border-red-300 bg-white px-4 py-2 font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-stone-400"
          >
            {isDeleting ? "Deleting..." : "Delete Book"}
          </button>
        </>
      ) : null}
    </main>
  );
}
