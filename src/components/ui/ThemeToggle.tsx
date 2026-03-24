import { useTheme } from "../../features/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      data-theme={theme}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb" />
      </span>
      <span className="theme-toggle-copy">
        <span className="theme-toggle-label">Theme</span>
        <span className="theme-toggle-value">{isDark ? "Dark" : "Light"}</span>
      </span>
    </button>
  );
}
