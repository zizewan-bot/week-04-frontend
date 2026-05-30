export type BookStatus = "want_to_read" | "reading" | "read";

export type Book = {
  id: number;
  title: string;
  author: string;
  status: BookStatus;
  rating: number | null;
};

export type BookInput = {
  title: string;
  author: string;
  status: BookStatus;
  rating: number | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "The API request failed.");
  }

  return response.json() as Promise<T>;
}

export function listBooks() {
  return request<Book[]>("/books");
}

export function getBook(id: string) {
  return request<Book>(`/books/${id}`);
}

export function createBook(book: BookInput) {
  return request<Book>("/books", {
    method: "POST",
    body: JSON.stringify(book),
  });
}

export function updateBook(id: string, book: Partial<BookInput>) {
  return request<Book>(`/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(book),
  });
}

export async function deleteBook(id: string) {
  await request<{ message: string }>(`/books/${id}`, {
    method: "DELETE",
  });
}
