import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../utils/NavigationType/type';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { wp, hp, scaleFont } from '../../utils/responcive/responcive';

import WealthSysLogo from '../../images/splash/WealthSys.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'SplashScreenOne'>;
const MANAGEMENT_TEXT = '';

const SplashScreenOne: React.FC<Props> = ({ navigation }) => {
  const [typedManagement, setTypedManagement] = useState('');

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let typingTimeout: ReturnType<typeof setTimeout>;
    let navigateTimeout: ReturnType<typeof setTimeout>;

    const continueToNextScreen = async () => {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.user);
      const storedPin = await AsyncStorage.getItem(STORAGE_KEYS.userPin);

      if (!storedUser) return navigation.replace('LoginIntro');
      navigation.replace(storedPin ? 'UnlockPin' : 'Tabs');
    };

    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(logoScale, {
            toValue: 24,          
            duration: 1000,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 0,          
            duration: 1000,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => {
          let index = 0;
          const typeNextCharacter = () => {
            index += 1;
            setTypedManagement(MANAGEMENT_TEXT.slice(0, index));
            if (index < MANAGEMENT_TEXT.length) {
              typingTimeout = setTimeout(typeNextCharacter, 100);
            } else {
              navigateTimeout = setTimeout(continueToNextScreen, 100);
            }
          };
          if (MANAGEMENT_TEXT.length === 0) {
            navigateTimeout = setTimeout(continueToNextScreen, 100);
          } else {
            typeNextCharacter();
          }
        });
      }, 1000); 
    });

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(navigateTimeout);
    };
  }, []);

  return (
    <LinearGradient
      colors={['#165CCE', '#1E3696']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacityAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }}
        >
          <WealthSysLogo width={wp(200)} height={hp(60)} />
        </Animated.View>

        <Text style={styles.managementText}>{typedManagement}</Text>
      </Animated.View>
    </LinearGradient>
  );
};

export default SplashScreenOne;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  managementText: {
    color: '#FFFFFF',
    fontSize: scaleFont(24),
    fontFamily: 'Urbanist-Regular',
    marginTop: hp(10),
    letterSpacing: 1,
  },
});