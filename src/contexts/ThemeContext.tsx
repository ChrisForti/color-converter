import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

// Helper function to get initial theme
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  
  // Check localStorage first
  const stored = localStorage.getItem("color-converter-theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  
  // Check system preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Helper function to apply theme to document
function applyThemeToDocument(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("color-converter-theme", newTheme);
    applyThemeToDocument(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  // Listen for system theme changes only if no stored preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only respond to system changes if user hasn't set a preference
      const hasStoredPreference = localStorage.getItem("color-converter-theme");
      if (!hasStoredPreference) {
        const systemTheme = e.matches ? "dark" : "light";
        setThemeState(systemTheme);
        applyThemeToDocument(systemTheme);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
