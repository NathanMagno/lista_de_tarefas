import { TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";

export default function ThemeToggleButton() {
  const { toggleTheme, colors, theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.button }]}
      onPress={toggleTheme}
    >
      <Ionicons
        name={theme == "light" ? "sunny" : "moon"}
        size={32}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "flex-start",
    alignSelf: "flex-end",
    marginBottom: "10%",
    marginRight: "8%",
    width: 30,
    height: 30,
  },
});
