import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Switch,
  Platform,
} from "react-native";
import {
  db,
  collection,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  onSnapshot,
  serverTimestamp,
  query,
  getAuth,
  updateDoc,
} from "../../src/services/firebaseConfig";
import { useTheme } from "../../src/context/themeContext";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import BaseScreens from "../../src/_components/BaseScreens/BaseScreens";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import ListaDeFilmes from "../../src/_components/ListadeFilmes";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Home() {
  const auth = getAuth();
  const user = auth.currentUser;
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const agendarNotificacaoTarefa = async (taskTitle, dueDateISO) => {
    const dueDateObj = new Date(dueDateISO);
    const now = new Date();
    if (dueDateObj <= now) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📝 Lembrete de Tarefa",
        body: `Hora de: ${taskTitle}`,
        sound: true,
      },
      trigger: {
        type: "date",
        date: new Date(dueDateISO),
      },
    });
  };

  const verificarPermissoes = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Permissão Negada", "Não será possível enviar notificações.");
    }
  };

  useEffect(() => {
    verificarPermissoes();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const list = [];
      for (const docItem of querySnapshot.docs) {
        const data = { id: docItem.id, ...docItem.data() };
        list.push(data);

        if (data.dueDate) {
          await agendarNotificacaoTarefa(data.title, data.dueDate);
        }
      }
      setTasks(list);
    });

    return unsubscribe;
  }, [user]);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      const currentDate = new Date(dueDate);
      currentDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setDueDate(currentDate);

      if (Platform.OS === "android") setShowTimePicker(true);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === "android") setShowTimePicker(false);
    if (selectedTime) {
      const currentDate = new Date(dueDate);
      currentDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDueDate(currentDate);
    }
  };

  const handleAddTask = async () => {
    if (!newTitle.trim()) {
      Alert.alert(
        t("handleAddTask.titleWarning"),
        t("handleAddTask.descWarning")
      );
      return;
    }

    const docRef = await addDoc(collection(db, "users", user.uid, "tasks"), {
      title: newTitle,
      description: newDescription,
      completed: false,
      dueDate: dueDate.toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await agendarNotificacaoTarefa(newTitle, dueDate.toISOString());

    setNewTitle("");
    setNewDescription("");
    setDueDate(new Date());
  };

  const handleDeleteTask = async (taskId) => {
    await deleteDoc(doc(db, "users", user.uid, "tasks", taskId));
  };

  const toggleCompleted = async (taskId, currentStatus) => {
    const taskRef = doc(db, "users", user.uid, "tasks", taskId);
    await updateDoc(taskRef, {
      completed: !currentStatus,
      updatedAt: serverTimestamp(),
    });
  };

  const formatDueDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <BaseScreens title={t("myTasks")} logoutButton>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.taskBox, { borderColor: colors.border }]}>
            <Switch
              value={item.completed}
              onValueChange={() => toggleCompleted(item.id, item.completed)}
              style={{ marginRight: 10 }}
              trackColor={{ false: colors.textSecondary }}
              thumbColor={item.completed ? colors.primary : "#fff"}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.taskTitle,
                  { color: colors.text },
                  item.completed && { textDecorationLine: "line-through" },
                ]}
              >
                {item.title}
              </Text>
              <Text style={{ color: colors.text }}>{item.description}</Text>
              {item.dueDate && (
                <Text style={{ color: colors.text }}>
                  📅 {formatDueDate(item.dueDate)}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
              <Text style={[styles.delete, { color: colors.danger }]}>
                {t("deleteTaskButton")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: colors.text }}>{t("noTaskAvailable")}</Text>
        }
      />

      <TextInput
        style={[
          styles.input,
          { borderColor: colors.primary, color: colors.text },
        ]}
        placeholder={t("taskTitlePlaceholder")}
        placeholderTextColor={colors.placeH}
        value={newTitle}
        onChangeText={setNewTitle}
      />
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.primary, color: colors.text },
        ]}
        placeholder={t("taskDescPlaceholder")}
        placeholderTextColor={colors.placeH}
        value={newDescription}
        onChangeText={setNewDescription}
      />

      <TouchableOpacity
        style={[styles.input, { borderColor: colors.primary }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: colors.text, fontSize: 18 }}>
          {t("dueDateButton")}: {formatDueDate(dueDate.toISOString())}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={dueDate}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <TouchableOpacity
        onPress={handleAddTask}
        style={[styles.btn, { backgroundColor: colors.primary }]}
      >
        <Text style={{ color: colors.text, fontSize: 20 }}>
          {t("addTaskButton")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.btnMovies }]}
        onPress={() => router.push("/home/filmes")}
      >
        <Text style={{ color: colors.text, fontSize: 20 }}>
          {t("moviesListButton")}
        </Text>
      </TouchableOpacity>
    </BaseScreens>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginBottom: "4%" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    fontSize: 18,
  },
  taskBox: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  taskTitle: { fontWeight: "bold", fontSize: 16 },
  delete: { marginLeft: 10 },
  btn: {
    height: 54,
    marginHorizontal: "20%",
    paddingInline: 24,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
