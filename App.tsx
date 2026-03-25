import React from 'react';
import { enableScreens } from 'react-native-screens';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './src/navagations/stack/stackNavigation';

enableScreens(); // 🔥 IMPORTANT

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <StackNavigator />
    </SafeAreaProvider>
  );
}

export default App;