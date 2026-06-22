import { useEffect, useState } from "react";
import BookCard from "./components/BookCard";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import LibraryControls from "./components/LibraryControls";
import StatsBar from "./components/StatsBar";
import ThemeToggle from "./components/ThemeToggle";
import type {
  Book,
  Filter,
  OpenLibraryDoc,
  OpenLibraryResponse,
  SortDir,
  SortKey,
  Status,
  Theme,
} from "./types";

const PIPELINE: Status[] = ["to-read", "reading", "finished"];

function loadLibrary(): Book[] {
  try {
    const data = JSON.parse(localStorage.getItem("library") ?? "");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function loadTheme(): Theme {
  return localStorage.getItem("theme") === "dark" ? "dark" : "light";
}

function App() {
  const [library, setLibrary] = useState<Book[]>(loadLibrary);
  const [theme, setTheme] = useState<Theme>(loadTheme);
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("dateAdded");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [results, setResults] = useState<OpenLibraryDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    localStorage.setItem("library", JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  async function runSearch(query: string) {
    const q = query.trim();
    if (q === "") return;
    setSearched(true);
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10`
      );
      if (!res.ok) throw new Error("Bad response");
      const data: OpenLibraryResponse = await res.json();
      setResults(data.docs);
    } catch {
      setError("Could not load search results. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function addBook(doc: OpenLibraryDoc) {
    setLibrary((prev) => {
      if (prev.some((b) => b.id === doc.key)) return prev;
      const book: Book = {
        id: doc.key,
        title: doc.title,
        author: doc.author_name?.[0] ?? "Unknown author",
        year: doc.first_publish_year ?? null,
        coverId: doc.cover_i ?? null,
        status: "to-read",
        rating: 0,
        dateAdded: Date.now(),
      };
      return [...prev, book];
    });
  }

  function advanceStatus(id: string) {
    setLibrary((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const i = PIPELINE.indexOf(b.status);
        return { ...b, status: PIPELINE[Math.min(i + 1, PIPELINE.length - 1)] };
      })
    );
  }

  function regressStatus(id: string) {
    setLibrary((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const i = PIPELINE.indexOf(b.status);
        return { ...b, status: PIPELINE[Math.max(i - 1, 0)] };
      })
    );
  }

  function deleteBook(id: string) {
    setLibrary((prev) => prev.filter((b) => b.id !== id));
  }

  function rateBook(id: string, stars: number) {
    setLibrary((prev) =>
      prev.map((b) =>
        b.id === id && b.status === "finished" ? { ...b, rating: stars } : b
      )
    );
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  const visibleBooks = [...library]
    .filter((b) => filter === "all" || b.status === filter)
    .sort((a, b) => {
      let cmp: number;
      if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      else if (sortKey === "author") cmp = a.author.localeCompare(b.author);
      else cmp = a.dateAdded - b.dateAdded;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const toRead = library.filter((b) => b.status === "to-read").length;
  const reading = library.filter((b) => b.status === "reading").length;
  const finished = library.filter((b) => b.status === "finished").length;
  const ratedFinished = library.filter(
    (b) => b.status === "finished" && b.rating > 0
  );
  const avgRating = ratedFinished.length
    ? ratedFinished.reduce((sum, b) => sum + b.rating, 0) / ratedFinished.length
    : null;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Reading Tracker</h1>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        <main className="space-y-8">
          <section className="space-y-3">
            <SearchBar onSearch={runSearch} loading={loading} />
            <SearchResults
              results={results}
              loading={loading}
              error={error}
              searched={searched}
              library={library}
              onAdd={addBook}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">My Library</h2>
            <StatsBar
              toRead={toRead}
              reading={reading}
              finished={finished}
              avgRating={avgRating}
            />
            <LibraryControls
              filter={filter}
              onFilterChange={setFilter}
              sortKey={sortKey}
              onSortKeyChange={setSortKey}
              sortDir={sortDir}
              onSortDirChange={setSortDir}
            />

            {library.length === 0 ? (
              <p className="rounded bg-gray-100 px-3 py-6 text-center text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Your library is empty — search above to add your first book.
              </p>
            ) : visibleBooks.length === 0 ? (
              <p className="rounded bg-gray-100 px-3 py-6 text-center text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                No books match this filter.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onAdvance={advanceStatus}
                    onRegress={regressStatus}
                    onDelete={deleteBook}
                    onRate={rateBook}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
