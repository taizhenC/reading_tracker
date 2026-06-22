type StatsBarProps = {
  toRead: number;
  reading: number;
  finished: number;
  avgRating: number | null;
};

function StatsBar({ toRead, reading, finished, avgRating }: StatsBarProps) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 rounded bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800">
      <span>
        {toRead} to read · {reading} reading · {finished} finished
      </span>
      <span className="text-gray-600 dark:text-gray-400">
        {avgRating === null
          ? "No ratings yet"
          : `${avgRating.toFixed(1)} ★ average`}
      </span>
    </div>
  );
}

export default StatsBar;
