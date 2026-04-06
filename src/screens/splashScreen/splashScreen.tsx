import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/NavigationType/type';

type Props = NativeStackScreenProps<RootStackParamList, 'SplashScreen'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current; // start normal size

  useEffect(() => {
  // 👇 STEP 0 → Show only blue screen for few ms
  const initialDelay = setTimeout(() => {

    // STEP 1 → Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {

      // STEP 2 → Hold
      setTimeout(() => {

        // STEP 3 → Expand
        Animated.timing(scale, {
          toValue: 1.8,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start(() => {

          setTimeout(() => {
            navigation.replace('LoginPhone');
          }, 1000);

        });

      }, 400);

    });

  }, 1200); // 👈 change this (200–500ms)

  return () => clearTimeout(initialDelay);
}, []);
  return (
    <LinearGradient
      colors={['#165CCE', '#1E3696']}
      style={styles.container}
    >
      <Animated.Image
        source={require('../../images/splash/splash.png')}
        resizeMode="contain"
        style={[
          styles.logo,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // center (auto handles top/left)
    alignItems: 'center',
  },
  logo: {
    width: 178,
    height: 76,
  },
});