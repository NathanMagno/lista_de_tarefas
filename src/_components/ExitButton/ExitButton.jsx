import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";
import { useTheme } from "../../context/themeContext";

export default function ExitButton() {
  const { colors } = useTheme();

  const realizarLogoff = async () => {
    await AsyncStorage.removeItem("@User");
    router.push("/Login");
  };

  return (
    <TouchableOpacity
      onPress={realizarLogoff}
      style={[styles.button, { backgroundColor: colors.button }]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="exit-outline" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    padding: 5,
    marginLeft: 12,
  },
});
