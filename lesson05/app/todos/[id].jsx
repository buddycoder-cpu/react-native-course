import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditTodo = () => {
  const { id } = useLocalSearchParams();
  const [todo, setTodo] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("todoApp");
        const storageTodos = jsonValue ? JSON.parse(jsonValue) : [];
        const selectedTodo = storageTodos.find(
          (t) => t.id.toString() === id
        );
        if (selectedTodo) {
          setTodo(selectedTodo);
        } else {
          router.back();
        }
      } catch (e) {
        console.error("Error loading todo:", e);
      }
    };

    fetchTodo();
  }, [id]);

  const handleSave = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("todoApp");
      const storageTodos = jsonValue ? JSON.parse(jsonValue) : [];

      const updatedTodos = storageTodos.map((t) =>
        t.id.toString() === id ? { ...t, title: todo.title } : t
      );

      await AsyncStorage.setItem("todoApp", JSON.stringify(updatedTodos));
      router.back();
    } catch (e) {
      console.error("Error saving todo:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Update your task..."
          placeholderTextColor="#888"
          value={todo?.title || ""}
          onChangeText={(text) => setTodo((prev) => ({ ...prev, title: text }))}
        />

        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.cancelButton}>
          <Text style={styles.saveButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default EditTodo;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fb", },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#2b2d42", },
  content: { flex: 1, margin: 20, backgroundColor: "#fff", borderRadius: 12, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, },
  input: { backgroundColor: "#f8f9fb", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, fontSize: 18, color: "#2b2d42", borderWidth: 1, borderColor: "#e0e0e0", marginBottom: 20, },
  saveButton: { backgroundColor: "#4CAF50", borderRadius: 12, paddingVertical: 12, alignItems: "center", marginBottom: 10, },
  cancelButton: { backgroundColor: "#E53935", borderRadius: 12, paddingVertical: 12, alignItems: "center", },
  saveButtonText: { color: "#fff", fontSize: 18, fontWeight: "600", },
});