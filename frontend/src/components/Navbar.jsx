import { useTheme } from "./context/ThemeContext";
import { IconButton } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";

export default function Navbar() {
  const { mode, toggleMode } = useTheme();

  return (
    <div className="flex justify-between p-4 shadow bg-white dark:bg-gray-800">
      <h1 className="font-bold text-lg text-green-700 dark:text-green-400">THDMS</h1>
      <IconButton onClick={toggleMode}>
        {mode === "light" ? <DarkMode /> : <LightMode />}
      </IconButton>
    </div>
  );
}