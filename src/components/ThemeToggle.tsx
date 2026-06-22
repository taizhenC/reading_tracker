import type { Theme } from "../types";

type ThemeToggleProps = {
  theme: Theme;
  onToggle: () => void;
};

function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded border border-gray-300 px-3 py-1 text-sm transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-600 dark:hover:bg-gray-700"
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

export default ThemeToggle;
