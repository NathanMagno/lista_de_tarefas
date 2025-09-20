import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function ToggleLanguage() {
  const { i18n } = useTranslation();

  function mudarIdioma (lang) {
    i18n.changeLanguage(lang);
  }
  
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