# Week 4 Book Tracker Frontend

Next.js frontend for the Week 4 full stack Book Tracker lab. It connects to the FastAPI backend through `NEXT_PUBLIC_API_URL`.

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment

Create a local `.env.local` file if needed:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The `.env.local` file is intentionally ignored by Git.

## Pages

- `/` - home page
- `/books` - list books from the backend
- `/books/new` - create a book
- `/books/[id]` - view, update, and delete a book
