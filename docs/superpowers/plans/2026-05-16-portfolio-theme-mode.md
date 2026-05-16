# Portfolio Theme Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dark/light mode that defaults to the visitor's system preference and persists explicit toggle choices.

**Architecture:** Add a small theme module with pure resolution helpers, a React provider that applies `data-theme` to `<html>`, and a navbar toggle that calls the provider. Use semantic CSS variables and theme-aware utility classes to make the current dark UI and new light UI share the same component structure.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, CSS custom properties, React Router.

---

## File Structure

- Create `src/theme/theme.ts`: pure theme types and helper functions.
- Create `src/theme/ThemeProvider.tsx`: React context, system preference listener, localStorage persistence, and hook.
- Modify `src/main.tsx`: wrap `<App />` in `<ThemeProvider>`.
- Modify `src/components/NavBar.tsx`: add desktop and mobile icon toggle.
- Modify `src/components/ModernButton.tsx`: make outline/ghost variants theme-aware.
- Modify `src/index.css`: add semantic variables and theme-aware reusable classes.
- Modify route/section components with hard-coded dark utility classes so all routes remain readable.

## Task 1: Theme State

- [ ] **Step 1: Verify missing provider fails the build**

Temporarily import `ThemeProvider` in `src/main.tsx` before it exists and run `npm run build`.

Expected: TypeScript fails because `./theme/ThemeProvider` cannot be found.

- [ ] **Step 2: Create theme helpers**

Create `src/theme/theme.ts` with:

```ts
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "portfolio-theme";

export const isTheme = (value: string | null): value is Theme =>
  value === "light" || value === "dark";

export const getSystemTheme = (matchesDark: boolean): Theme =>
  matchesDark ? "dark" : "light";

export const resolveInitialTheme = (
  storedTheme: string | null,
  matchesDark: boolean,
): { theme: Theme; source: "stored" | "system" } => {
  if (isTheme(storedTheme)) {
    return { theme: storedTheme, source: "stored" };
  }

  return { theme: getSystemTheme(matchesDark), source: "system" };
};

export const getNextTheme = (theme: Theme): Theme =>
  theme === "dark" ? "light" : "dark";
```

- [ ] **Step 3: Create provider**

Create `src/theme/ThemeProvider.tsx` with:

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getNextTheme,
  getSystemTheme,
  resolveInitialTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "./theme";

type ThemeContextValue = {
  theme: Theme;
  isSystemPreference: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getMediaQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

const getInitialState = () => {
  if (typeof window === "undefined") {
    return { theme: "dark" as Theme, isSystemPreference: true };
  }

  const resolved = resolveInitialTheme(
    window.localStorage.getItem(THEME_STORAGE_KEY),
    getMediaQuery().matches,
  );

  return {
    theme: resolved.theme,
    isSystemPreference: resolved.source === "system",
  };
};

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => getInitialState().theme);
  const [isSystemPreference, setIsSystemPreference] = useState(
    () => getInitialState().isSystemPreference,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (!isSystemPreference) {
      return;
    }

    const mediaQuery = getMediaQuery();
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      setTheme(getSystemTheme(event.matches));
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [isSystemPreference]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme = getNextTheme(currentTheme);
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      return nextTheme;
    });
    setIsSystemPreference(false);
  }, []);

  const value = useMemo(
    () => ({ theme, isSystemPreference, toggleTheme }),
    [theme, isSystemPreference, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
```

- [ ] **Step 4: Wrap app**

Modify `src/main.tsx` so `<App />` is wrapped in `<ThemeProvider>`.

- [ ] **Step 5: Run build**

Run `npm run build`.

Expected: Build progresses past missing provider. Fix TypeScript issues before moving on.

## Task 2: Theme Toggle

- [ ] **Step 1: Add provider usage to navbar**

Import `useTheme` in `src/components/NavBar.tsx` and derive:

```ts
const { theme, toggleTheme } = useTheme();
const themeLabel =
  theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
const themeIcon = theme === "dark" ? "☀" : "☾";
```

- [ ] **Step 2: Add desktop and mobile buttons**

Add `<button type="button" className="theme-toggle" aria-label={themeLabel} onClick={toggleTheme}>` beside the desktop actions and inside the mobile action area.

- [ ] **Step 3: Build**

Run `npm run build`.

Expected: TypeScript passes for navbar integration.

## Task 3: Semantic CSS

- [ ] **Step 1: Add theme variables**

In `src/index.css`, define dark variables on `:root` and light variables on `:root[data-theme="light"]` for background, surface, elevated surface, card, text, muted text, soft text, border, overlay, input, and accent.

- [ ] **Step 2: Add reusable theme classes**

Add `.theme-page`, `.theme-section`, `.theme-section-alt`, `.theme-card`, `.theme-card-soft`, `.theme-text`, `.theme-muted`, `.theme-soft`, `.theme-border`, and `.theme-toggle`.

- [ ] **Step 3: Migrate shared component CSS**

Update `body`, `.navbar`, mobile menu, form controls, `.card-border`, timeline rails/logos, and gradient edges to use variables.

- [ ] **Step 4: Build**

Run `npm run build`.

Expected: CSS compiles through Vite.

## Task 4: Component Theme Patches

- [ ] **Step 1: Patch repeated sections and route wrappers**

Use theme classes in `AboutMe`, `ServiceHighlights`, `BlogArticles`, `ProcessMethodologies`, `CaseStudies`, `Projects`, `ProjectTemplate`, `Blog`, `BlogPost`, and `Footer` where hard-coded dark surfaces/text make light mode unreadable.

- [ ] **Step 2: Patch cards and modal**

Use theme classes in `ProjectCard`, `Modal`, and shared card-like surfaces.

- [ ] **Step 3: Build**

Run `npm run build`.

Expected: TypeScript and Vite build pass.

## Task 5: Visual Verification

- [ ] **Step 1: Start dev server**

Run `npm run dev -- --host 127.0.0.1`.

- [ ] **Step 2: Check routes manually**

Open the local URL and verify the toggle on desktop/mobile-sized layouts, including `/`, `/about`, `/projects`, `/case-studies`, `/blog`, and `/process`.

- [ ] **Step 3: Final build**

Run `npm run build`.

Expected: Exit code 0.
