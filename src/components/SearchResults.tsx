import type { Book, OpenLibraryDoc } from "../types";

type SearchResultsProps = {
  results: OpenLibraryDoc[];
  loading: boolean;
  error: string;
  searched: boolean;
  library: Book[];
  onAdd: (doc: OpenLibraryDoc) => void;
};

function SearchResults({
  results,
  loading,
  error,
  searched,
  library,
  onAdd,
}: SearchResultsProps) {
  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Searching...</p>;
  }

  if (error) {
    return (
      <p className="rounded bg-red-100 px-3 py-2 text-red-700 dark:bg-red-950 dark:text-red-300">
        {error}
      </p>
    );
  }

  if (!searched) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        Search for a book to get started.
      </p>
    );
  }

  if (results.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No results found.</p>;
  }

  return (
    <ul className="space-y-2">
      {results.map((doc) => {
        const inLibrary = library.some((b) => b.id === doc.key);
        const cover = doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`
          : null;
        return (
          <li
            key={doc.key}
            className="flex items-center gap-3 rounded bg-gray-50 p-2 dark:bg-gray-800"
          >
            {cover ? (
              <img
                src={cover}
                alt={`Cover of ${doc.title}`}
                className="h-16 w-12 flex-shrink-0 rounded object-cover"
              />
            ) : (
              <div className="flex h-16 w-12 flex-shrink-0 items-center justify-center rounded bg-gray-200 text-center text-[10px] text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                No cover
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{doc.title}</p>
              <p className="truncate text-sm text-gray-600 dark:text-gray-400">
                {doc.author_name?.[0] ?? "Unknown author"}
                {doc.first_publish_year ? ` · ${doc.first_publish_year}` : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onAdd(doc)}
              disabled={inLibrary}
              className="rounded bg-indigo-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {inLibrary ? "Added" : "Add"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default SearchResults;
