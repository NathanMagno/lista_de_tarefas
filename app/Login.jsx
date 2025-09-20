import { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/services/firebaseConfig";
import { useTheme } from "../src/context/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import ToggleLanguage from "../src/_components/LanguageToggleButton/LanguageToggleButton";
import ThemeToggleButton from "../src/_components/ToggleThemeButton";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const router = useRouter();
  const [hidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const verificarUsuarioLogado = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("@User");
        if (usuarioSalvo) {
          router.replace("/home");
        }
      } catch (error) {
        console.log("Erro ao verificar login: ", error);
      }
    };
    verificarUsuarioLogado();
  }, []);

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(
        t("login.emptyFieldsWarningTitle"),
        t("login.emptyFieldsWarningDesc")
      );
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await AsyncStorage.setItem("@User", JSON.stringify(user));

        Alert.alert(
          t("login.successLoginTitle"),
          t("login.successLoginDesc")
        );
        router.replace("/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        let message = "";
        if (errorCode === "auth/invalid-credential") {
          message = t("login.invalidCredentials");
        } else {
          message = t("login.genericError");
        }
        setError(message);
      });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {t("login.title")}
        </Text>
        <View>
          <ThemeToggleButton />
          <ToggleLanguage />
        </View>
      </View>
      <View style={styles.formContainer}>
        <View style={[styles.inputBox, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={t("login.emailPlaceholder")}
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputBox, { backgroundColor: colors.surface }]}>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1, color: colors.text }]}
              placeholder={t("login.passwordPlaceholder")}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={hidePassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.eyeBtn}
            >
              <View style={styles.eyeCircle}>
                <Icon
                  name={hidePassword ? "eye-off" : "eye"}
                  size={22}
                  color={colors.primary}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ minHeight: 22, justifyContent: "center" }}>
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {error !== "" ? error : " "}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.btn, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: colors.textSecondary, fontSize: 20 }}>
            {t("login.loginButton")}
          </Text>
        </TouchableOpacity>
      </View>
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
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  btn: {
    height: 54,
    marginHorizontal: "16%",
    paddingInline: 24,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  formContainer: {
    flex: 0.75,
    gap: "5%",
    justifyContent: "center",
  },
  inputBox: {
    borderRadius: 24,
    paddingHorizontal: 18,
    height: 56,
    justifyContent: "center",
    marginBottom: 24,
  },
  input: {
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 1,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeBtn: {
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
});
