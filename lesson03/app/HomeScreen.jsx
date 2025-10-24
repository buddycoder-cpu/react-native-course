import React, { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const HomeScreen = () => {
  const { theme, toggleTheme, themeColors } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColors.background,
    },
    text: {
      color: themeColors.text,
      fontSize: 20,
      marginBottom: 20,
    },
    title: {
      color: themeColors.title,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Theme: {theme}</Text>
      <Text style={styles.text}>This is a sample text</Text>
      <Button title="Toggle Theme" onPress={toggleTheme} color={themeColors.primary} />
    </View>
  );
};

export default HomeScreen;