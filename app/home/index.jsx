import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
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

export default function Home() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [comp, setComp] = useState(false);

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
      Alert.alert("Atenção", "O título é obrigatório.");
      return;
    }
    await addDoc(collection(db, "users", user.uid, "tasks"), {
      title: newTitle,
      description: newDescription,
      completed: comp,
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
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Tarefas</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskBox}>
            <Switch
              value={item.completed}
              onValueChange={() => toggleCompleted(item.id, item.completed)}
              style={{ marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.taskTitle,
                  item.completed && { textDecorationLine: "line-through" },
                ]}
              >
                {item.title}
              </Text>
              <Text>{item.description}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
              <Text style={styles.delete}>Deletar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhuma tarefa cadastrada.</Text>}
      />

      <TextInput
        style={styles.input}
        placeholder="Título da tarefa"
        value={newTitle}
        onChangeText={setNewTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição (opcional)"
        value={newDescription}
        onChangeText={setNewDescription}
      />
      <Button title="Adicionar Tarefa" onPress={handleAddTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 8 },
  taskBox: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  taskTitle: { fontWeight: "bold", fontSize: 16 },
  delete: { color: "red", marginLeft: 10 },
});
