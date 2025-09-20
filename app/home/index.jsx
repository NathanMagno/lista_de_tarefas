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

export default function Home() {
  const auth = getAuth();
  const user = auth.currentUser;
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setTasks(list);
    });
    return unsubscribe;
  }, [user]);

  const handleAddTask = async () => {
    if (!newTitle.trim()) {
      Alert.alert(
        t("handleAddTask.titleWarning"),
        t("handleAddTask.descWarning")
      );
      return;
    }
    await addDoc(collection(db, "users", user.uid, "tasks"), {
      title: newTitle,
      description: newDescription,
      completed: false,
      dueDate: "2025-09-10T14:00:00Z",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setNewTitle("");
    setNewDescription("");
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
  return (
    <BaseScreens title={t("myTasks")}>
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
        style={[styles.input, { borderColor: colors.primary }]}
        placeholder={t("taskTitlePlaceholder")}
        placeholderTextColor={colors.placeH}
        value={newTitle}
        onChangeText={setNewTitle}
      />
      <TextInput
        style={[styles.input, { borderColor: colors.primary }]}
        placeholder={t("taskDescPlaceholder")}
        placeholderTextColor={colors.placeH}
        value={newDescription}
        onChangeText={setNewDescription}
      />
      <TouchableOpacity
        onPress={handleAddTask}
        style={[styles.btn, { backgroundColor: colors.primary }]}
      >
        <Text style={{ color: colors.text, fontSize: 20 }}>
          {t("addTaskButton")}
        </Text>
      </TouchableOpacity>
      <View style={{ marginTop: 16 }}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.btnMovies }]}
          onPress={() => router.push("/home/filmes")}
        >
          <Text style={{ color: colors.text, fontSize: 20 }}>
            {t("moviesListButton")}
          </Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 30,
  },
});
