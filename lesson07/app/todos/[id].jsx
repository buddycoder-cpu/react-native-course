import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getTodoById, updateTodo } from '../../services/todoServices';


const EditTodo = () => {
  const { id } = useLocalSearchParams(); // gets the todo ID from the URL
  const [todo, setTodo] = useState(null);
  const [title, setTitle] = useState('');

  const fetchTodo = async () => {
    try {
      const response = await getTodoById(id);
      setTodo(response);
      setTitle(response.title);
    } catch (error) {
      console.error('Error fetching todo:', error);
      Alert.alert('Error', 'Could not fetch todo details.');
    }
  };

  // Update todo
  const handleSave = async () => {
    if (!title.trim()) return Alert.alert('Validation', 'Todo title cannot be empty.');

    try {
      await updateTodo(id, { title });
      Alert.alert('Success', 'Todo updated successfully!');
      router.back(); // Go back to the list screen
    } catch (error) {
      console.error('Error updating todo:', error);
      Alert.alert('Error', 'Failed to update todo.');
    }
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  if (!todo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading todo...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Update your task..."
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
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