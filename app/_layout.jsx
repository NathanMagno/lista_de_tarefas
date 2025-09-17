import { Stack } from "expo-router";
import { ThemeProvider } from "../src/context/themeContext";

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="Login"
          options={{
            title: "Tela de Login",
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
