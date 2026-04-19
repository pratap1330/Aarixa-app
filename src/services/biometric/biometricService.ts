import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics, {
  BiometryTypes,
  type BiometryType,
} from 'react-native-biometrics';
import { STORAGE_KEYS } from '../../constants/storageKeys';

export type SupportedBiometryType = BiometryType | 'Unknown';

export interface BiometricStatus {
  available: boolean;
  biometryType?: SupportedBiometryType;
  label: string;
  error?: string;
}

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

const getBiometryLabel = (biometryType?: BiometryType): string => {
  switch (biometryType) {
    case BiometryTypes.FaceID:
      return 'Face ID';
    case BiometryTypes.TouchID:
      return 'Touch ID';
    case BiometryTypes.Biometrics:
      return 'Fingerprint';
    default:
      return 'Biometric';
  }
};

export const getBiometricStatus = async (): Promise<BiometricStatus> => {
  try {
    const { available, biometryType, error } =
      await rnBiometrics.isSensorAvailable();

    return {
      available,
      biometryType: biometryType ?? 'Unknown',
      label: getBiometryLabel(biometryType),
      error,
    };
  } catch (error) {
    return {
      available: false,
      label: 'Biometric',
      error: error instanceof Error ? error.message : 'Biometric unavailable',
    };
  }
};

export const promptBiometricVerification = async (
  promptMessage: string,
): Promise<boolean> => {
  try {
    const { success } = await rnBiometrics.simplePrompt({
      promptMessage,
      cancelButtonText: 'Cancel',
      fallbackPromptMessage: 'Use your device passcode',
    });

    return success;
  } catch {
    return false;
  }
};

export const isBiometricLoginEnabled = async (): Promise<boolean> => {
  const isEnabled = await AsyncStorage.getItem(STORAGE_KEYS.biometricEnabled);
  return isEnabled === 'true';
};

export const enableBiometricLogin = async (): Promise<void> => {
  const { keysExist } = await rnBiometrics.biometricKeysExist();

  if (!keysExist) {
    await rnBiometrics.createKeys();
  }

  await AsyncStorage.setItem(STORAGE_KEYS.biometricEnabled, 'true');
};

export const enableBiometricLoginWithVerification = async (
  promptMessage: string,
): Promise<boolean> => {
  const { keysExist } = await rnBiometrics.biometricKeysExist();

  if (!keysExist) {
    await rnBiometrics.createKeys();
  }

  const isVerified = await promptBiometricVerification(promptMessage);

  if (!isVerified) {
    return false;
  }

  await AsyncStorage.setItem(STORAGE_KEYS.biometricEnabled, 'true');
  return true;
};

export const disableBiometricLogin = async (): Promise<void> => {
  try {
    await rnBiometrics.deleteKeys();
  } catch {
    // Ignore key deletion failures and still disable the local preference.
  }

  await AsyncStorage.removeItem(STORAGE_KEYS.biometricEnabled);
};
