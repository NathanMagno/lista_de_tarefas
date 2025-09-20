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
      background: "#ffffff",
      surface: "#C0C0C0",
      text: "#222B32",
      textSecondary: "#e2e2e2",
      danger: "#DD3C2F",
      primary: "#0c6ae6",
      border: "#DDE3E9",
      placeH: "#7d91b6",
      btnMovies: "#39ac0f",
      inputBg: "#F9F9F9"
    },
    dark: {
      background: "#0A0A0A",
      surface: "#202938",
      text: "#FAFAFA",
      textSecondary: "#4e5155",
      danger: "#F64A3A",
      primary: "#2483ff",
      placeH: "#c4d9ff",
      border: "#262626",
      btnMovies: "#63ff2bff",
      inputBg: "#1A1A1A"
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
