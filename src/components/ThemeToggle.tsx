import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const isTheme = (value: string | null): value is Theme =>
  value === "light" || value === "dark" || value === "system";

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem("theme");
    return isTheme(storedTheme) ? storedTheme : "system";
  });
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    theme === "system" ? getSystemTheme() : theme,
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const nextTheme = theme === "system" ? getSystemTheme() : theme;

      root.classList.remove("light", "dark");
      root.classList.add(nextTheme);
      root.style.colorScheme = nextTheme;
      setResolvedTheme(nextTheme);
    };

    applyTheme();
    localStorage.setItem("theme", theme);

    if (theme !== "system") {
      return;
    }

    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [theme]);

  const label =
    resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex size-10 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-950 transition-colors hover:border-emerald-500 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:border-emerald-400 dark:hover:text-emerald-300"
      aria-label={label}
      title={label}
    >
      {resolvedTheme === "dark" ? (
        <Sun aria-hidden="true" className="size-5" strokeWidth={2} />
      ) : (
        <Moon aria-hidden="true" className="size-5" strokeWidth={2} />
      )}
    </button>
  );
}
