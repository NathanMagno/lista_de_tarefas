import { useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ToggleLanguage() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem("appLanguage");
        if (savedLang) {
          i18n.changeLanguage(savedLang);
        }
      } catch (error) {
        console.log("Erro ao carregar idioma:", error);
      }
    };
    loadLanguage();
  }, []);

  async function mudarIdioma(lang) {
    try {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem("appLanguage", lang);
    } catch (error) {
      console.log("Erro ao mudar idioma:", error);
    }
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
    gap: 10,
  },
  flags: {
    fontSize: 24,
  },
});
