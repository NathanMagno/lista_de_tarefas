import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import ThemeToggleButton from "../ToggleThemeButton/ToggleThemeButton";
import ToggleLanguage from "../LanguageToggleButton/LanguageToggleButton";
import { useTheme } from "../../context/themeContext";
import ExitButton from "../ExitButton/ExitButton";

export default function BaseScreens({ children, title, logoutButton = false }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThemeToggleButton />
            {logoutButton && <ExitButton />}
          </View>
          <ToggleLanguage />
        </View>
      </View>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
});
