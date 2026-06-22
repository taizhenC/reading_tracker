export type Status = "to-read" | "reading" | "finished";
export type Filter = "all" | Status;
export type SortKey = "title" | "author" | "dateAdded";
export type SortDir = "asc" | "desc";
export type Theme = "light" | "dark";

export type Book = {
  id: string;
  title: string;
  author: string;
  year: number | null;
  coverId: number | null;
  status: Status;
  rating: number;
  dateAdded: number;
};

export type OpenLibraryDoc = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
};

export type OpenLibraryResponse = {
  docs: OpenLibraryDoc[];
};
