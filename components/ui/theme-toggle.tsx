"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after component is mounted
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="rounded-md p-2 bg-transparent focus:outline-none"
        disabled
        aria-label="Loading theme"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all text-muted-foreground" />
      </button>
    );
  }

  return (
    <button
      className="rounded-md p-2 bg-transparent hover:bg-muted focus:outline-none transition-colors"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-300 transition-all" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 transition-all" />
      )}
    </button>
  );
}
