import { createContext, useContext, type ReactNode } from "react";

export type ColorMode = "dark" | "light" | "white";

interface ColorModeContextValue {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

export interface ThemeProviderProps {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  children: ReactNode;
}

export function ThemeProvider({
  colorMode,
  setColorMode,
  children,
}: ThemeProviderProps) {
  return (
    <ColorModeContext.Provider value={{ colorMode, setColorMode }}>
      <div data-color-mode={colorMode}>{children}</div>
    </ColorModeContext.Provider>
  );
}

export function useColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within a ThemeProvider");
  }
  return context;
}
