import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { mudarIdioma } from "../../utils/mudarIdioma";

export default function ToggleLanguage() {
  return (
    <View style={styles.content}>
      <TouchableOpacity onPress={() => mudarIdioma("pt")}>
        <Text style={styles.flags}>🇧🇷</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => mudarIdioma("es")}>
        <Text style={styles.flags}>🇪🇸</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => mudarIdioma("en")}>
        <Text style={styles.flags}>🇺🇸</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    content: {
        flexDirection: "row",
        gap: 10
    },
    flags: {
        fontSize: 24
    }
})