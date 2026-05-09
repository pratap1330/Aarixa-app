// import React, { useCallback, useMemo, useRef, useState } from 'react';
// import {
//   Alert,
//   Dimensions,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Keychain from 'react-native-keychain'; 
// import { useFocusEffect } from '@react-navigation/native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// import Lock from '../../images/loginImage/lock.svg';
// import { STORAGE_KEYS } from '../../constants/storageKeys';
// import { usePost } from '../../hooks/usePost'; // Aapka custom hook import karein
// import {
//   getBiometricStatus,
//   isBiometricLoginEnabled,
//   promptBiometricVerification,
// } from '../../services/biometric/biometricService';
// import { RootStackParamList } from '../../utils/NavigationType/type';

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// const wp = (size: number) => (SCREEN_WIDTH / 375) * size;
// const hp = (size: number) => (SCREEN_HEIGHT / 812) * size;
// const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

// type Props = NativeStackScreenProps<RootStackParamList, 'UnlockPin'>;

// const UnlockPinScreen: React.FC<Props> = ({ navigation }) => {
//   // --- Initialize Hook ---
//   const { postData, loading: apiLoading } = usePost(); 

//   const [pin, setPin] = useState<string[]>(Array(4).fill(''));
//   const [savedPin, setSavedPin] = useState('');
//   const [biometricLabel, setBiometricLabel] = useState('Biometric');
//   const [canUseBiometric, setCanUseBiometric] = useState(false);
//   const [isLocallyProcessing, setIsLocallyProcessing] = useState(false); // Local loading for UI
  
//   const inputRefs = useRef<TextInput[]>([]);
//   const enteredPin = useMemo(() => pin.join(''), [pin]);

//   const isLoading = apiLoading || isLocallyProcessing;

//   const hydrateUnlockState = useCallback(async () => {
//     try {
//       const [storedUser, storedPin, biometricEnabled, biometricStatus] =
//         await Promise.all([
//           AsyncStorage.getItem(STORAGE_KEYS.user),
//           AsyncStorage.getItem(STORAGE_KEYS.userPin),
//           isBiometricLoginEnabled(),
//           getBiometricStatus(),
//         ]);

//       if (!storedUser) {
//         navigation.reset({ index: 0, routes: [{ name: 'LoginIntro' }] });
//         return;
//       }

//       if (!storedPin) {
//         navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
//         return;
//       }

//       setSavedPin(storedPin);
//       setBiometricLabel(biometricStatus.label);
//       setCanUseBiometric(biometricEnabled && biometricStatus.available);
//     } catch {
//       navigation.reset({ index: 0, routes: [{ name: 'LoginIntro' }] });
//     }
//   }, [navigation]);

//   useFocusEffect(
//     useCallback(() => {
//       hydrateUnlockState();
//     }, [hydrateUnlockState]),
//   );

//   // --- Background Login Logic ---
//   const performSilentLogin = async () => {
//     try {
//       const credentials = await Keychain.getGenericPassword();
//       console.log("Credentials:", credentials); // 🔍 DEBUG

// if (!credentials || !credentials.username || !credentials.password) {
//   Alert.alert("Error", "Credentials not found. Please login again.");
//   return false;
// }

//       // if (!credentials) return false;

//       const payload = {
//         username: credentials.username,
//         password: credentials.password,
//       };

//       // Hook ka postData use kar rahe hain
//       const res = await postData("api/auth/client-login", payload);
      
//       if (res?.status === 1) {
//         const cid = res?.result?.user?.cid;
//         await AsyncStorage.setItem(STORAGE_KEYS.cid, String(cid));
//         await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(res?.result?.user));
//         return true;
//       } else {
//         Alert.alert("Session Expired", res?.message || "Please login again.");
//         return false;
//       }
//     } catch (error) {
//       console.error("Silent Login Error:", error);
//       return false;
//     }
//   };

//   const unlockApp = async () => {
//     setIsLocallyProcessing(true);
    
//     const success = await performSilentLogin();
    
//     setIsLocallyProcessing(false);

//     if (success) {
//       navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
//     } else {
//       navigation.reset({ index: 0, routes: [{ name: 'LoginIntro' }] });
//     }
//   };

//   const handleUnlockWithPin = () => {
//     if (enteredPin.length !== 4) return;
//     if (enteredPin !== savedPin) {
//       Alert.alert('Invalid PIN', 'The PIN you entered is incorrect.');
//       setPin(Array(4).fill(''));
//       inputRefs.current[0]?.focus();
//       return;
//     }
//     unlockApp();
//   };

//   const handleBiometricUnlock = async () => {
//     const isVerified = await promptBiometricVerification(
//         `Unlock WealthSys with ${biometricLabel}`,
//     );
//    if (isVerified) {
//     setTimeout(() => {
//       unlockApp();   
//     }, 2000);
//   }
//   };

//   const handleChange = (text: string, index: number) => {
//     if (text && !/^\d$/.test(text)) return;
//     const nextPin = [...pin];
//     nextPin[index] = text;
//     setPin(nextPin);
//     if (text && index < nextPin.length - 1) {
//       inputRefs.current[index + 1]?.focus();
//     }
//     if (!text && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={styles.container}
//     >
//       <Text style={styles.title}>Welcome back</Text>
//       <Lock style={styles.image} />

//       <View style={styles.box}>
//         <Text style={styles.subtitle}>Unlock your account with your 4-digit PIN.</Text>

//         <View style={styles.pinRow}>
//           {pin.map((value, index) => (
//             <TextInput
//               key={index}
//               ref={(ref) => { if (ref) inputRefs.current[index] = ref; }}
//               style={styles.pinInput}
//               keyboardType="number-pad"
//               maxLength={1}
//               secureTextEntry
//               value={value}
//               onChangeText={(text) => handleChange(text, index)}
//               editable={!isLoading} // Loading ke waqt inputs disable karein
//               autoFocus={index === 0}
//             />
//           ))}
//         </View>

//         <TouchableOpacity
//           style={[styles.button, { opacity: (enteredPin.length === 4 && !isLoading) ? 1 : 0.5 }]}
//           disabled={enteredPin.length < 4 || isLoading}
//           onPress={handleUnlockWithPin}
//         >
//           {isLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Unlock with PIN</Text>
//           )}
//         </TouchableOpacity>

//         {canUseBiometric && !isLoading ? (
//           <TouchableOpacity
//             style={styles.secondaryButton}
//             onPress={handleBiometricUnlock}
//           >
//             <Ionicons name="finger-print-outline" size={wp(18)} color="#2288FD" />
//             <Text style={styles.secondaryButtonText}>Use {biometricLabel}</Text>
//           </TouchableOpacity>
//         ) : null}
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default UnlockPinScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//   },
//   title: {
//     width: wp(331),
//     marginTop: hp(122),
//     textAlign: 'center',
//     fontSize: scaleFont(30),
//     fontFamily: 'Urbanist-SemiBold',
//     color: '#1E232C',
//   },
//   image: {
//     width: wp(245),
//     height: hp(204),
//     marginTop: hp(12),
//   },
//   box: {
//     width: wp(357),
//     marginTop: hp(12),
//     alignItems: 'center',
//     gap: hp(24),
//   },
//   subtitle: {
//     width: wp(304),
//     textAlign: 'center',
//     fontFamily: 'Urbanist-Medium',
//     fontSize: scaleFont(16),
//     color: '#838BA1',
//   },
//   pinRow: {
//     width: wp(357),
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 30,
//   },
//   pinInput: {
//     width: 50,
//     height: 44,
//     marginTop: 4,
//     borderWidth: 1.5,
//     borderColor: '#2288FD',
//     borderRadius: 10,
//     textAlign: 'center',
//     fontSize: scaleFont(16),
//     fontFamily: 'Urbanist-Medium',
//     color: '#1E232C',
//     backgroundColor: '#fff',
//   },
//   button: {
//     width: wp(331),
//     height: hp(45),
//     borderRadius: wp(10),
//     backgroundColor: '#2288FD',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: scaleFont(16),
//     fontFamily: 'Urbanist-Medium',
//   },
//   secondaryButton: {
//     width: wp(331),
//     height: hp(45),
//     borderRadius: wp(10),
//     borderWidth: 1.2,
//     borderColor: '#2288FD',
//     backgroundColor: '#F7FAFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     gap: wp(8),
//   },
//   secondaryButtonText: {
//     color: '#2288FD',
//     fontSize: scaleFont(15),
//     fontFamily: 'Urbanist-SemiBold',
//   },
// });




// // // --- Modified Silent Login with Logging ---
// //   const performSilentLogin = async () => {
// //     try {
// //       console.log("Fetching credentials from Keychain...");
// //       const credentials = await Keychain.getGenericPassword();
      
// //       if (!credentials) {
// //         console.log("No credentials found in Keychain!");
// //         // Agar password nahi mila, toh silent login nahi ho sakta
// //         Alert.alert("Error", "Security credentials not found. Please login again with password.");
// //         return false;
// //       }

// //       console.log("Credentials found, calling API for:", credentials.username);

// //       const payload = {
// //         username: credentials.username,
// //         password: credentials.password,
// //       };

// //       const res = await postData("api/auth/client-login", payload);
      
// //       if (res?.status === 1) {
// //         await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(res?.result?.user));
// //         await AsyncStorage.setItem(STORAGE_KEYS.cid, String(res?.result?.user?.cid));
// //         return true;
// //       } else {
// //         return false;
// //       }
// //     } catch (error) {
// //       console.error("Silent Login Error:", error);
// //       return false;
// //     }
// //   };

// //   const handleBiometricUnlock = async () => {
// //     try {
// //       const isVerified = await promptBiometricVerification(
// //         `Unlock Aarixa with ${biometricLabel}`,
// //       );

// //       if (isVerified) {
// //         console.log("Biometric Verified! Now calling unlockApp...");
// //         // API call yahan se start hogi
// //         await unlockApp(); 
// //       } else {
// //         console.log("Biometric Verification Failed or Cancelled");
// //       }
// //     } catch (err) {
// //       console.error("Biometric Error:", err);
// //       Alert.alert("Error", "Biometric verification failed.");
// //     }
// //   };




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
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain'; 
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import Lock from '../../images/loginImage/lock.svg';
import GoogleIcon from '../../images/loginImage/google.svg';
import AppleIcon from '../../images/loginImage/apple.svg';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { usePost } from '../../hooks/usePost'; // Aapka custom hook import karein
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
  // --- Initialize Hook ---
  const { postData, loading: apiLoading } = usePost(); 

  const [pin, setPin] = useState<string[]>(Array(4).fill(''));
  const [savedPin, setSavedPin] = useState('');
  const [biometricLabel, setBiometricLabel] = useState('Biometric');
  const [canUseBiometric, setCanUseBiometric] = useState(false);
  const [isLocallyProcessing, setIsLocallyProcessing] = useState(false); // Local loading for UI
  const [hasPromptedBiometric, setHasPromptedBiometric] = useState(false);
  
  const inputRefs = useRef<TextInput[]>([]);
  const enteredPin = useMemo(() => pin.join(''), [pin]);

  const isLoading = apiLoading || isLocallyProcessing;

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
        navigation.reset({ index: 0, routes: [{ name: 'LoginIntro' }] });
        return;
      }

      if (!storedPin) {
        navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
        return;
      }

      setSavedPin(storedPin);
      setBiometricLabel(biometricStatus.label);
      setCanUseBiometric(biometricEnabled && biometricStatus.available);
    } catch {
      navigation.reset({ index: 0, routes: [{ name: 'LoginIntro' }] });
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        await hydrateUnlockState();
        if (!hasPromptedBiometric && canUseBiometric) {
          setHasPromptedBiometric(true);
          const isVerified = await promptBiometricVerification(`Unlock WealthSys with ${biometricLabel}`);
          if (isVerified) {
            unlockApp();
          }
        }
      };
      init();
    }, [hydrateUnlockState, hasPromptedBiometric, canUseBiometric, biometricLabel]),
  );

  // --- Background Login Logic ---
  const performSilentLogin = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      console.log("Credentials:", credentials); // 🔍 DEBUG

if (!credentials || !credentials.username || !credentials.password) {
  Alert.alert("Error", "Credentials not found. Please login again.");
  return false;
}

      // if (!credentials) return false;

      const payload = {
        username: credentials.username,
        password: credentials.password,
      };

      // Hook ka postData use kar rahe hain
      const res = await postData("api/auth/client-login", payload);
      
      if (res?.status === 1) {
        const cid = res?.result?.user?.cid;
        await AsyncStorage.setItem(STORAGE_KEYS.cid, String(cid));
        await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(res?.result?.user));
        return true;
      } else {
        Alert.alert("Session Expired", res?.message || "Please login again.");
        return false;
      }
    } catch (error) {
      console.error("Silent Login Error:", error);
      return false;
    }
  };

  const unlockApp = async () => {
    setIsLocallyProcessing(true);
    
    const success = await performSilentLogin();
    
    setIsLocallyProcessing(false);

    if (success) {
      navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'LoginIntro' }] });
    }
  };

  const handleUnlockWithPin = () => {
    if (enteredPin.length !== 4) return;
    if (enteredPin !== savedPin) {
      Alert.alert('Invalid PIN', 'The PIN you entered is incorrect.');
      setPin(Array(4).fill(''));
      inputRefs.current[0]?.focus();
      return;
    }
    unlockApp();
  };

  const handleBiometricUnlock = async () => {
    const isVerified = await promptBiometricVerification(
        `Unlock WealthSys with ${biometricLabel}`,
    );
   if (isVerified) {
    setTimeout(() => {
      unlockApp();   
    }, 500);
  }
  };

  const handleChange = (text: string, index: number) => {
    if (text && !/^\d$/.test(text)) return;
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#165CCE', '#1E3696']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradient}
        >
          <Image
            source={require('../../images/loginImage/ruppe1.png')}
            style={styles.rupeeIcon}
          />

          <View style={styles.topShape} />

          <View style={styles.card}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Unlock your account with your 4-digit PIN.</Text>

            <View style={styles.pinRow}>
              {pin.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { if (ref) inputRefs.current[index] = ref; }}
                  style={styles.pinInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  secureTextEntry
                  value={value}
                  onChangeText={(text) => handleChange(text, index)}
                  editable={!isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.button, { opacity: (enteredPin.length === 4 && !isLoading) ? 1 : 0.5 }]}
              disabled={enteredPin.length < 4 || isLoading}
              onPress={handleUnlockWithPin}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Unlock with PIN</Text>
              )}
            </TouchableOpacity>

            {canUseBiometric && !isLoading ? (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleBiometricUnlock}
              >
                <Ionicons name="finger-print-outline" size={wp(18)} color="#2288FD" />
                <Text style={styles.secondaryButtonText}>Use {biometricLabel}</Text>
              </TouchableOpacity>
            ) : null}

            <View style={styles.socialDivider}>
              <LinearGradient
                colors={['#165CCE', '#1E3696']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dividerLineGradient}
              />
              <Text style={styles.dividerText}>or continue with</Text>
              <LinearGradient
                colors={['#165CCE', '#1E3696']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dividerLineGradient}
              />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <GoogleIcon width={24} height={24} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <AppleIcon width={19.51} height={19.51} />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UnlockPinScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#165CCE',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
    width: '100%',
    minHeight: hp(844),
  },
  topShape: {
    height: hp(173),
  },
  rupeeIcon: {
    position: 'absolute',
    right: wp(10),
    width: wp(162),
    height: hp(240),
    resizeMode: 'contain',
    opacity: 1,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: hp(30),
    borderTopLeftRadius: wp(40),
    borderTopRightRadius: wp(40),
    paddingHorizontal: wp(18),
    paddingTop: hp(32),
    alignItems: 'center',
    paddingBottom: hp(40),
  },
  title: {
    fontSize: scaleFont(30),
    fontWeight: '700',
    color: '#111827',
    marginBottom: hp(70),
  },
  subtitle: {
    fontSize: scaleFont(13),
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: hp(30),
  },
  pinRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(16),
    marginBottom: hp(70),
  },
  pinInput: {
    width: wp(50),
    height: hp(50),
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: wp(12),
    textAlign: 'center',
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: '100%',
    height: hp(44),
    backgroundColor: '#165CCE',
    borderRadius: wp(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(24),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
  secondaryButton: {
    width: '100%',
    height: hp(44),
    borderRadius: wp(26),
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F7FAFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp(8),
  },
  secondaryButtonText: {
    color: '#2288FD',
    fontSize: scaleFont(15),
    fontWeight: '600',
  },
  socialDivider: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(20),
     marginTop: hp(90),
  },
  dividerLineGradient: {
    width: wp(114),
    height: 1,
  },
  dividerText: {
    marginHorizontal: wp(12),
    color: '#6B7280',
    fontSize: scaleFont(13),
  },
  socialRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(12),
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(44),
    borderRadius: wp(26),
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    gap: wp(8),
  },
  socialButtonText: {
    fontSize: scaleFont(12),
    color: '#111827',
    marginLeft: wp(8),
  },
});




// // --- Modified Silent Login with Logging ---
//   const performSilentLogin = async () => {
//     try {
//       console.log("Fetching credentials from Keychain...");
//       const credentials = await Keychain.getGenericPassword();
      
//       if (!credentials) {
//         console.log("No credentials found in Keychain!");
//         // Agar password nahi mila, toh silent login nahi ho sakta
//         Alert.alert("Error", "Security credentials not found. Please login again with password.");
//         return false;
//       }

//       console.log("Credentials found, calling API for:", credentials.username);

//       const payload = {
//         username: credentials.username,
//         password: credentials.password,
//       };

//       const res = await postData("api/auth/client-login", payload);
      
//       if (res?.status === 1) {
//         await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(res?.result?.user));
//         await AsyncStorage.setItem(STORAGE_KEYS.cid, String(res?.result?.user?.cid));
//         return true;
//       } else {
//         return false;
//       }
//     } catch (error) {
//       console.error("Silent Login Error:", error);
//       return false;
//     }
//   };

//   const handleBiometricUnlock = async () => {
//     try {
//       const isVerified = await promptBiometricVerification(
//         `Unlock Aarixa with ${biometricLabel}`,
//       );

//       if (isVerified) {
//         console.log("Biometric Verified! Now calling unlockApp...");
//         // API call yahan se start hogi
//         await unlockApp(); 
//       } else {
//         console.log("Biometric Verification Failed or Cancelled");
//       }
//     } catch (err) {
//       console.error("Biometric Error:", err);
//       Alert.alert("Error", "Biometric verification failed.");
//     }
//   };