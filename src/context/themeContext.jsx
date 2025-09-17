import { createContext, useContext, useState } from "react";
import { Appearance } from "react-native";

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const colorTheme = Appearance.getColorScheme();

  const [theme, setTheme] = useState(colorTheme || "light");

  const toggleTheme = () => {
    setTheme((value) => (value === "light" ? "dark" : "light"));
  };

  const themeColors = {
    light: {
      background: "#F4F7FA",
      surface: "#C0C0C0",
      text: "#222B32",
      textSecondary: "#9cc0d1",
      danger: "#DD3C2F",
      primary: "#2865b6",
      border: "#DDE3E9",
    },
    dark: {
      background: "#0A0A0A",
      surface: "#202938",
      text: "#FAFAFA",
      textSecondary: "#4e5155",
      danger: "#F64A3A",
      primary: "#448be7",
      border: "#262626",
    },
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, colors: themeColors[theme] }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
