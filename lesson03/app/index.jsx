import { registerRootComponent } from 'expo';
import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import HomeScreen from './HomeScreen';

function App() {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}

// Register the root component for React Native
registerRootComponent(App);