import type { Book, Status } from "../types";

const STATUS_LABELS: Record<Status, string> = {
  "to-read": "To Read",
  reading: "Reading",
  finished: "Finished",
};

const btn =
  "rounded border border-gray-300 px-2 py-1 text-sm transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700";

type BookCardProps = {
  book: Book;
  onAdvance: (id: string) => void;
  onRegress: (id: string) => void;
  onDelete: (id: string) => void;
  onRate: (id: string, stars: number) => void;
};

function BookCard({ book, onAdvance, onRegress, onDelete, onRate }: BookCardProps) {
  const cover = book.coverId
    ? `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`
    : null;

  return (
    <div className="flex flex-col rounded-lg bg-gray-50 p-4 shadow dark:bg-gray-800">
      <div className="flex gap-4">
        {cover ? (
          <img
            src={cover}
            alt={`Cover of ${book.title}`}
            className="h-28 w-20 flex-shrink-0 rounded object-cover"
          />
        ) : (
          <div className="flex h-28 w-20 flex-shrink-0 items-center justify-center rounded bg-gray-200 text-center text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
            No cover
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{book.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
          {book.year && (
            <p className="text-sm text-gray-500 dark:text-gray-500">{book.year}</p>
          )}
          <span className="mt-2 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
            {STATUS_LABELS[book.status]}
          </span>
        </div>
      </div>

      {book.status === "finished" && (
        <div className="mt-3 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onRate(book.id, n)}
              aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
              className={
                "text-xl transition hover:scale-110 focus:outline-none " +
                (n <= book.rating ? "text-yellow-500" : "text-gray-400")
              }
            >
              {n <= book.rating ? "★" : "☆"}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onRegress(book.id)}
          disabled={book.status === "to-read"}
          className={btn}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => onAdvance(book.id)}
          disabled={book.status === "finished"}
          className={btn}
        >
          Forward →
        </button>
        <button
          type="button"
          onClick={() => onDelete(book.id)}
          className="rounded border border-red-300 px-2 py-1 text-sm text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BookCard;
