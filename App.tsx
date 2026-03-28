import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View,Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import StackNavigator from './src/navagations/stack/stackNavigation';
import { Provider } from 'react-redux';
import { store } from './src/redux/store/store';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Provider store={store}>  
      <SafeAreaProvider>     
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <StackNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

// function AppContent() {
//   const safeAreaInsets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <NewAppScreen
//         templateFileName="App.tsx"
//         safeAreaInsets={safeAreaInsets}
//       />
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;