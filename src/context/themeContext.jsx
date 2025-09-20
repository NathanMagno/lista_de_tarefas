import { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const colorTheme = Appearance.getColorScheme();

  const [theme, setTheme] = useState(colorTheme || "light");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("@AppTheme");
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.log("Erro ao carregar tema:", error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      await AsyncStorage.setItem("@AppTheme", newTheme);
    } catch (error) {
      console.log("Erro ao salvar tema:", error);
    }
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
      inputBg: "#F9F9F9",
      btnText: "#FFF"
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
      btnMovies: "#369613",
      inputBg: "#1A1A1A",
      btnText: "#FFF"
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
