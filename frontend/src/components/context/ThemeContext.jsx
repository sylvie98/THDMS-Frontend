import { createContext, useState, useContext, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export default function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  const toggleMode = () => setMode(mode === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}