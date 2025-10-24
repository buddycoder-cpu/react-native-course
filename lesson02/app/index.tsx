import React, { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const users = [
  {
    name: 'Jane Doe',
    age: 25,
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Frontend Developer who loves React Native and traveling.',
    email: 'alice.johnson@example.com',
  },
  {
    name: 'John Doe',
    age: 30,
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Backend Developer passionate about Node.js and photography.',
    email: 'bob.smith@example.com',
  },
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [age, setAge] = useState(users[0].age);

  const toggleUser = () => {
    const newIndex = currentIndex === 0 ? 1 : 0;
    setCurrentIndex(newIndex);
    setAge(users[newIndex].age); // reset age when switching user
  };

  const incrementAge = () => setAge(age + 1);
  const resetInfo = () => setAge(users[currentIndex].age);

  const currentUser = users[currentIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: currentUser.photo }} style={styles.photo} />
      <Text style={styles.name}>{currentUser.name}</Text>
      <Text style={styles.age}>Age: {age}</Text>
      <Text style={styles.bio}>{currentUser.bio}</Text>
      <Text style={styles.email}>{currentUser.email}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Toggle User" onPress={toggleUser} />
        <Button title="Increase Age" onPress={incrementAge} />
        <Button title="Reset Info" onPress={resetInfo} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  age: {
    fontSize: 18,
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});

export default App;``