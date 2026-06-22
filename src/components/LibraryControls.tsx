import type { Filter, SortDir, SortKey } from "../types";

type LibraryControlsProps = {
  filter: Filter;
  onFilterChange: (value: Filter) => void;
  sortKey: SortKey;
  onSortKeyChange: (value: SortKey) => void;
  sortDir: SortDir;
  onSortDirChange: (value: SortDir) => void;
};

const select =
  "rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-600 dark:bg-gray-800";

function LibraryControls({
  filter,
  onFilterChange,
  sortKey,
  onSortKeyChange,
  sortDir,
  onSortDirChange,
}: LibraryControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <label className="flex items-center gap-1">
        Show
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as Filter)}
          className={select}
        >
          <option value="all">All</option>
          <option value="to-read">To Read</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
        </select>
      </label>

      <label className="flex items-center gap-1">
        Sort by
        <select
          value={sortKey}
          onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
          className={select}
        >
          <option value="dateAdded">Date added</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>
      </label>

      <label className="flex items-center gap-1">
        Order
        <select
          value={sortDir}
          onChange={(e) => onSortDirChange(e.target.value as SortDir)}
          className={select}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>
  );
}

export default LibraryControls;
