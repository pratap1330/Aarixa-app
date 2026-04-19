import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lock from '../../images/loginImage/lock.svg';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import {
  getBiometricStatus,
  isBiometricLoginEnabled,
  promptBiometricVerification,
} from '../../services/biometric/biometricService';
import { RootStackParamList } from '../../utils/NavigationType/type';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const wp = (size: number) => (SCREEN_WIDTH / 375) * size;
const hp = (size: number) => (SCREEN_HEIGHT / 812) * size;
const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

type Props = NativeStackScreenProps<RootStackParamList, 'UnlockPin'>;

const UnlockPinScreen: React.FC<Props> = ({ navigation }) => {
  const [pin, setPin] = useState<string[]>(Array(4).fill(''));
  const [savedPin, setSavedPin] = useState('');
  const [biometricLabel, setBiometricLabel] = useState('Biometric');
  const [canUseBiometric, setCanUseBiometric] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  const enteredPin = useMemo(() => pin.join(''), [pin]);

  const hydrateUnlockState = useCallback(async () => {
    try {
      const [storedUser, storedPin, biometricEnabled, biometricStatus] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.user),
          AsyncStorage.getItem(STORAGE_KEYS.userPin),
          isBiometricLoginEnabled(),
          getBiometricStatus(),
        ]);

      if (!storedUser) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginPhone' }],
        });
        return;
      }

      if (!storedPin) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
        return;
      }

      setSavedPin(storedPin);
      setBiometricLabel(biometricStatus.label);
      setCanUseBiometric(biometricEnabled && biometricStatus.available);
    } catch {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginPhone' }],
      });
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      hydrateUnlockState();
    }, [hydrateUnlockState]),
  );

  const resetPin = () => {
    setPin(Array(4).fill(''));
    inputRefs.current[0]?.focus();
  };

  const unlockApp = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' }],
    });
  };

  const handleChange = (text: string, index: number) => {
    if (text && !/^\d$/.test(text)) {
      return;
    }

    const nextPin = [...pin];
    nextPin[index] = text;
    setPin(nextPin);

    if (text && index < nextPin.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleUnlockWithPin = () => {
    if (enteredPin.length !== 4) {
      return;
    }

    if (enteredPin !== savedPin) {
      Alert.alert('Invalid PIN', 'The PIN you entered is incorrect.');
      resetPin();
      return;
    }

    unlockApp();
  };

  const handleBiometricUnlock = async () => {
    const isVerified = await promptBiometricVerification(
      `Unlock Aarixa with ${biometricLabel}`,
    );

    if (!isVerified) {
      Alert.alert(
        'Verification cancelled',
        `Use your ${biometricLabel.toLowerCase()} again or continue with your PIN.`,
      );
      return;
    }

    unlockApp();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Welcome back</Text>

      <Lock style={styles.image} />

      <View style={styles.box}>
        <Text style={styles.subtitle}>
          Unlock your account with your 4-digit PIN.
        </Text>

        <View style={styles.pinRow}>
          {pin.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) {
                  inputRefs.current[index] = ref;
                }
              }}
              style={styles.pinInput}
              keyboardType="number-pad"
              maxLength={1}
              secureTextEntry
              value={value}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { opacity: enteredPin.length === 4 ? 1 : 0.5 }]}
          disabled={enteredPin.length < 4}
          onPress={handleUnlockWithPin}
        >
          <Text style={styles.buttonText}>Unlock with PIN</Text>
        </TouchableOpacity>

        {canUseBiometric ? (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleBiometricUnlock}
          >
            <Ionicons
              name="finger-print-outline"
              size={wp(18)}
              color="#2288FD"
            />
            <Text style={styles.secondaryButtonText}>
              Use {biometricLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
};

export default UnlockPinScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    width: wp(331),
    marginTop: hp(122),
    textAlign: 'center',
    fontSize: scaleFont(30),
    fontFamily: 'Urbanist-SemiBold',
    color: '#1E232C',
  },
  image: {
    width: wp(245),
    height: hp(204),
    marginTop: hp(12),
  },
  box: {
    width: wp(357),
    marginTop: hp(12),
    alignItems: 'center',
    gap: hp(24),
  },
  subtitle: {
    width: wp(304),
    textAlign: 'center',
    fontFamily: 'Urbanist-Medium',
    fontSize: scaleFont(16),
    color: '#838BA1',
  },
  pinRow: {
    width: wp(357),
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
  },
  pinInput: {
    width: 50,
    height: 44,
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: '#2288FD',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: scaleFont(16),
    fontFamily: 'Urbanist-Medium',
    color: '#1E232C',
    backgroundColor: '#fff',
  },
  button: {
    width: wp(331),
    height: hp(45),
    borderRadius: wp(10),
    backgroundColor: '#2288FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: scaleFont(16),
    fontFamily: 'Urbanist-Medium',
  },
  secondaryButton: {
    width: wp(331),
    height: hp(45),
    borderRadius: wp(10),
    borderWidth: 1.2,
    borderColor: '#2288FD',
    backgroundColor: '#F7FAFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp(8),
  },
  secondaryButtonText: {
    color: '#2288FD',
    fontSize: scaleFont(15),
    fontFamily: 'Urbanist-SemiBold',
  },
});
