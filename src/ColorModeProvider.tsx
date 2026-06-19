import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CssBaseline, ThemeProvider, type PaletteMode } from "@mui/material";
import { createAppTheme } from "./theme";

interface ColorModeContextValue {
  mode: PaletteMode;
  toggleMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: "light",
  toggleMode: () => {},
});

const STORAGE_KEY = "jdot-paraphraser-color-mode";

function getInitialMode(): PaletteMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  // Default to light (day) mode for first-time visitors.
  return "light";
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo<ColorModeContextValue>(
    () => ({ mode, toggleMode: () => setMode((m) => (m === "light" ? "dark" : "light")) }),
    [mode],
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useColorMode() {
  return useContext(ColorModeContext);
}
