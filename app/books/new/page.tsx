"use client";

import { useRouter } from "next/navigation";
import { BookForm } from "@/components/BookForm";
import { BookInput, createBook } from "@/lib/api";

export default function NewBookPage() {
  const router = useRouter();

  async function handleCreate(book: BookInput) {
    const createdBook = await createBook(book);
    router.push(`/books/${createdBook.id}`);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-4xl font-bold text-stone-950">
        Add a Book
      </h1>
      <p className="mt-2 text-stone-700">
        Create a new record in the PostgreSQL-backed API.
      </p>
      <section className="mt-8 rounded-md border border-stone-200 bg-white p-6 shadow-sm">
        <BookForm submitLabel="Create Book" onSubmit={handleCreate} />
      </section>
    </main>
  );
}
