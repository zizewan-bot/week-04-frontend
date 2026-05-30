"use client";

import { FormEvent, useState } from "react";
import type { Book, BookInput, BookStatus } from "@/lib/api";

type BookFormProps = {
  initialBook?: Book;
  submitLabel: string;
  onSubmit: (book: BookInput) => Promise<void>;
};

const statuses: { value: BookStatus; label: string }[] = [
  { value: "want_to_read", label: "Want to read" },
  { value: "reading", label: "Reading" },
  { value: "read", label: "Read" },
];

export function BookForm({ initialBook, submitLabel, onSubmit }: BookFormProps) {
  const [title, setTitle] = useState(initialBook?.title ?? "");
  const [author, setAuthor] = useState(initialBook?.author ?? "");
  const [status, setStatus] = useState<BookStatus>(
    initialBook?.status ?? "want_to_read",
  );
  const [rating, setRating] = useState(
    initialBook?.rating ? String(initialBook.rating) : "",
  );
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await onSubmit({
        title,
        author,
        status,
        rating: status === "read" ? Number(rating) : null,
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The book could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-stone-700" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 outline-none transition focus:border-emerald-600"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700" htmlFor="author">
          Author
        </label>
        <input
          id="author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 outline-none transition focus:border-emerald-600"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-stone-700" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as BookStatus)}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 outline-none transition focus:border-emerald-600"
          >
            {statuses.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700" htmlFor="rating">
            Rating
          </label>
          <input
            id="rating"
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            disabled={status !== "read"}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 outline-none transition focus:border-emerald-600 disabled:bg-stone-100 disabled:text-stone-400"
            required={status === "read"}
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="rounded-md bg-emerald-700 px-4 py-2 font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {isSaving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
