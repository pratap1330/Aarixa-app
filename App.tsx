import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import StackNavigator from './src/navagations/stack/stackNavigation';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/redux/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setThemePreferences } from './src/redux/slices/themeSlice';

const THEME_STORAGE_KEY = 'appThemePreferences';

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useDispatch();

  useEffect(() => {
    const hydrateTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (!savedTheme) {
          return;
        }

        dispatch(setThemePreferences(JSON.parse(savedTheme)));
      } catch {
        // ignore invalid saved theme data
      }
    };

    hydrateTheme();
  }, [dispatch]);



  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <StackNavigator />
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
