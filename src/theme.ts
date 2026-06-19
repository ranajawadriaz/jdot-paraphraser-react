import { createTheme, type PaletteMode } from "@mui/material";

const fontStack = [
  "Inter",
  "system-ui",
  "-apple-system",
  "Segoe UI",
  "Roboto",
  "Helvetica",
  "Arial",
  "sans-serif",
].join(",");

/**
 * Builds the application theme for the given color mode. A single source of
 * truth for both light and dark palettes keeps the look consistent.
 */
export function createAppTheme(mode: PaletteMode) {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: { main: isLight ? "#4f46e5" : "#818cf8" },
      secondary: { main: "#10b981" },
      background: {
        default: isLight ? "#f4f5fb" : "#0e0f1a",
        paper: isLight ? "#ffffff" : "#171826",
      },
      text: {
        primary: isLight ? "#1f2333" : "#e7e9f2",
        secondary: isLight ? "#5b6072" : "#a3a8bd",
      },
      divider: isLight ? "rgba(31,35,51,0.10)" : "rgba(231,233,242,0.12)",
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: fontStack,
      h1: { fontWeight: 800, letterSpacing: "-0.02em" },
      h6: { fontWeight: 700, letterSpacing: "-0.01em" },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 999 } },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backdropFilter: "saturate(180%) blur(8px)",
          },
        },
      },
    },
  });
}
