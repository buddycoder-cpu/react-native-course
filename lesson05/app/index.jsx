import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';

const index = () => {
    
    const [todoList, setTodoList] = useState([])
    const [todo, setTodo] = useState('')

    const addTodo = () => {
        const newId = todoList.length > 0 ? Math.max(...todoList.map(t => t.id)) + 1: 1;
        setTodoList([{ id: newId, title: todo, completed: false }, ...todoList])
        setTodo('')
    }

    const toggleTodo = (id) => {
        setTodoList(
            todoList.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo)
        )
    }

    const removeTodo = (id) => {
        setTodoList(todoList.filter(todo => todo.id !==id));
    }

    // Save the todo list to AsyncStorage
   const saveTodos = async (todos) => {
   try {
       const jsonValue = JSON.stringify(todos);
       await AsyncStorage.setItem('todoApp', jsonValue);
   } catch (e) {
       console.error('Error saving todos:', e);
   }
   };

   const loadTodos = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('todoApp');
        const parsedTodos = jsonValue != null ? JSON.parse(jsonValue) : [];
        setTodoList(parsedTodos);
        return parsedTodos;
    } catch (e) {
        console.error('Error loading todos:', e);
        return [];
    }
  };

   // Load Saved Todos When the App Starts
    useEffect(() => {
        const fetchTodos = async () => {
            const storedTodos = await 
            loadTodos();
                if (storedTodos.length > 0)  
            { setTodoList(storedTodos); }
            };

            fetchTodos();
    }, []);

    // Save Todo whenever button saved
    useEffect(() => {
        saveTodos(todoList);
    }, [todoList]);

    // When screen gain focus ... 
    useFocusEffect(
      React.useCallback(() => {
        // ...
      }, [])
    );

    const renderItem = ({ item }) => (
        <View style={styles.todoItem}>
            <Text
            style={[styles.todoText, item.completed && styles.completedText]}
            numberOfLines={1}
            onPress={() => toggleTodo(item.id)}
            >
            {item.title}
            </Text>
            <View style={styles.actionButtons}>
                <Pressable onPress={() => router.push(`/todos/${item.id}`)}>
                    <MaterialCommunityIcons name='pencil' size={26} color='blue'/>
                </Pressable>
                <Pressable onPress={() => removeTodo(item.id)}>
                    <MaterialCommunityIcons name='trash-can' size={26} color='red'/>
                </Pressable>
            </View>
        </View>
    );

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
           <Text style={styles.headerTitle}>To-Do List</Text>
       </View>
       <View style={styles.inputContainer}>
           <TextInput
               style={styles.input}
               placeholder="What do you need to do?"
               placeholderTextColor="#888"
               value={todo}
               onChangeText={setTodo}
           />
           <Pressable onPress={addTodo} style={styles.addButton}> 
                <MaterialCommunityIcons name='plus' size={10} color='green'/>
           </Pressable>
       </View>

        <FlatList
          data={todoList}
          renderItem={renderItem}
          keyExtractor={(todo) => todo.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet! Add one above</Text>}
        />
    </SafeAreaView>
  );
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, 
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2b2d42",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 18,
    padding: 10,
    color: "#2b2d42",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  todoText: {
    fontSize: 18,
    color: "#2b2d42",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#9a9a9a",
  },
  deleteButton: {
    marginLeft: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 50,
    fontSize: 16,
  },
});