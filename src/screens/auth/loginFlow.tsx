// import React, { useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   Image,
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../utils/NavigationType/type';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { wp, hp, scaleFont } from '../../utils/responcive/responcive';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { validateUsername, validatePassword } from '../../utils/validation/validation';
// import { usePost } from '../../hooks/usePost';
// import { STORAGE_KEYS } from '../../constants/storageKeys';

// type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// const LoginFlow: React.FC<Props> = ({ navigation, route }) => {
//   const { postData, loading } = usePost();
//   // const { phone } = route.params;
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [usernameFocused, setUsernameFocused] = useState(false);
//   const [passwordFocused, setPasswordFocused] = useState(false);

//   const [usernameError, setUsernameError] = useState('');
//   const [passwordError, setPasswordError] = useState('');

//   const isFormValid = useMemo(() => {
//     return username.length > 0 && password.length > 0 && !usernameError && !passwordError;
//   }, [username, password, usernameError, passwordError]);

//   const handleLogin = async () => {
//     debugger
//     const usernameCheck = validateUsername(username);
//     const passwordCheck = validatePassword(password);

//     setUsernameError(usernameCheck.isValid ? '' : usernameCheck.message);
//     setPasswordError(passwordCheck.isValid ? '' : passwordCheck.message);

//     if (!usernameCheck.isValid || !passwordCheck.isValid) return;

//     try {
//       const payload = {
//         username,
//         password,
//       };
//       const res = await postData('api/auth/client-login', payload);

//       if (res?.status === 1) {
//         await AsyncStorage.setItem(STORAGE_KEYS.cid, String(res?.result?.user?.cid));
//         await AsyncStorage.setItem(STORAGE_KEYS.fhid, String(res?.result?.user?.fhid));
//         await AsyncStorage.setItem(STORAGE_KEYS.levelNo, String(res?.result?.user?.levelNo));
//         await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(res?.result?.user));

//         navigation.navigate('CreatePin', {
//           username,
//           password,
//           apiLoginDone: true,
//         });
//       } else {
//         Alert.alert('Login failed', res?.message || 'Unable to login.');
//       }
//     } catch (error: any) {
//       Alert.alert('Login failed', error?.message || 'Unable to login.');
//     }
//   };

//   return (
//     <KeyboardAwareScrollView
//       contentContainerStyle={styles.container}
//       enableOnAndroid={true}
//       keyboardShouldPersistTaps="handled"
//       extraScrollHeight={Platform.OS === 'ios' ? 30 : 80}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* ===== APP LOGO ===== */}
//       {/* <Image
//         source={require("../../images/splash/splash.png")}
//         style={styles.logo}
//       /> */}

//       {/* ===== TITLE ===== */}
//       {/* <Text style={styles.title}>Login</Text> */}

//       <View style={styles.formGroup}>

//         {/* ===== USERNAME ===== */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Username</Text>
//           <View style={[styles.inputBox, usernameFocused ? styles.inputBoxFocused : styles.inputBoxDefault]}>
//             <Ionicons
//               name="person-outline"
//               size={scaleFont(18)}
//               color="#007AFF"
//             />
//             <TextInput
//               style={styles.inputFlex}
//               value={username}
//               placeholder="Yourname"
//               placeholderTextColor="#9CA3AF"
//               onChangeText={(text) => {
//                 setUsername(text);
//                 setUsernameError('');
//               }}
//               onFocus={() => setUsernameFocused(true)}
//               onBlur={() => {
//                 setUsernameFocused(false);
//                 const res = validateUsername(username);
//                 setUsernameError(res.isValid ? '' : res.message);
//               }}
//               autoCapitalize="none"
//             />
//           </View>
//           {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
//         </View>

//         {/* ===== PASSWORD ===== */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Password</Text>
//           <View style={[styles.inputBox, passwordFocused ? styles.inputBoxFocused : styles.inputBoxDefault]}>
//             <Ionicons
//               name="lock-closed-outline"
//               size={scaleFont(18)}
//               color="#9CA3AF"
//             />
//             <TextInput
//               style={styles.inputFlex}
//               value={password}
//               placeholder="Enter Password"
//               placeholderTextColor="#9CA3AF"
//               onChangeText={(text) => {
//                 setPassword(text);
//                 setPasswordError('');
//               }}
//               onFocus={() => setPasswordFocused(true)}
//               onBlur={() => {
//                 setPasswordFocused(false);
//                 const res = validatePassword(password);
//                 setPasswordError(res.isValid ? '' : res.message);
//               }}
//               secureTextEntry={!showPassword}
//               autoCapitalize="none"
//             />
//             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//               <Image
//                 source={require('../../images/loginImage/eye.png')}
//                 style={{
//                   width: wp(22),
//                   height: wp(22),
//                   tintColor: '#6B7280',
//                   resizeMode: 'contain',
//                 }}
//               />
//             </TouchableOpacity>
//           </View>
//           {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
//         </View>

//         {/* ===== LOGIN BUTTON ===== */}
//         <TouchableOpacity
//           style={[styles.loginButton, { opacity: isFormValid ? 1 : 0.5 }]}
//           disabled={!isFormValid}
//           onPress={handleLogin}
//         >
//           <Text style={styles.loginButtonText}>Login</Text>
//         </TouchableOpacity>

//       </View>

//       {/* ===== FORGOT PASSWORD ===== */}
//       <TouchableOpacity>
//         <Text style={styles.forgotText}>Forgot your password?</Text>
//       </TouchableOpacity>

//     </KeyboardAwareScrollView>
//   );
// };

// export default LoginFlow;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#FFFFFF',
//     paddingBottom: hp(40),
//   },

//   // "App LOGO" — Urbanist ExtraBold 32px, #2288FD, top 80px
//   logo: {
//     marginTop: hp(40),
//     width: wp(160),
//     height: hp(120),
//     alignSelf: "center",
//     resizeMode: "contain",
//     tintColor: "#2288FD",
//   },

//   // "Login" — Urbanist Bold 30px, #1E232C, top ~160px (5px after logo)
//   title: {
//     marginTop: hp(5),
//     textAlign: 'center',
//     fontSize: scaleFont(30),
//     fontWeight: '700',
//     color: '#1E232C',
//     lineHeight: scaleFont(39),
//     letterSpacing: -0.3,
//   },

//   // Form group: top 223px, left/right 17px → paddingHorizontal wp(17)
//   formGroup: {
//     marginTop: hp(175),
//     paddingHorizontal: wp(17),
//     gap: hp(16),
//   },

//   fieldContainer: {
//     width: '100%',
//   },

//   // Label — Urbanist Regular 14px, #000000
//   label: {
//     fontSize: scaleFont(14),
//     fontWeight: '400',
//     color: '#000000',
//     marginBottom: hp(8),
//   },

//   // Input box — height 44px, border-radius 10px, padding 10 12, gap 8
//   inputBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: hp(44),
//     borderRadius: wp(10),
//     borderWidth: 1,
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: wp(12),
//     gap: wp(8),
//   },

//   // Default border (unfocused) — #D1D5DB
//   inputBoxDefault: {
//     borderColor: '#D1D5DB',
//   },

//   // Focused border — #007AFF
//   inputBoxFocused: {
//     borderColor: '#007AFF',
//   },

//   inputFlex: {
//     flex: 1,
//     fontSize: scaleFont(16),
//     color: '#000000',
//     paddingVertical: 0,
//     ...Platform.select({ android: { includeFontPadding: false } }),
//   },

//   errorText: {
//     marginTop: hp(4),
//     fontSize: scaleFont(12),
//     color: 'red',
//   },

//   // Login button — height 45px, border-radius 10px, #2288FD
//   loginButton: {
//     marginTop: hp(10),
//     height: hp(45),
//     backgroundColor: '#2288FD',
//     borderRadius: wp(10),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Button text — Urbanist SemiBold 15px, #FFFFFF
//   loginButtonText: {
//     color: '#FFFFFF',
//     fontSize: scaleFont(15),
//     fontWeight: '600',
//   },

//   // Forgot text — Urbanist SemiBold 15px, #2288FD
//   forgotText: {
//     marginTop: hp(24),
//     textAlign: 'center',
//     color: '#2288FD',
//     fontSize: scaleFont(15),
//     fontWeight: '600',
//     letterSpacing: 0.15,
//   },
// });


// import React, { useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   Image,
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../utils/NavigationType/type';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { wp, hp, scaleFont } from '../../utils/responcive/responcive';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
// import { validateUsername, validatePassword } from '../../utils/validation/validation';
// import { usePost } from '../../hooks/usePost';
// import { STORAGE_KEYS } from '../../constants/storageKeys';
// import GoogleIcon from '../../images/loginImage/google.svg';
// import AppleIcon from '../../images/loginImage/apple.svg';
// import LoginRupee from '../../images/loginImage/loginrupee.svg';

// type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// const LoginFlow: React.FC<Props> = ({ navigation, route }) => {
//   const { postData, loading } = usePost();
//   // const { phone } = route.params;
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [usernameFocused, setUsernameFocused] = useState(false);
//   const [passwordFocused, setPasswordFocused] = useState(false);

//   const [usernameError, setUsernameError] = useState('');
//   const [passwordError, setPasswordError] = useState('');

//   const isFormValid = useMemo(() => {
//     return username.length > 0 && password.length > 0 && !usernameError && !passwordError;
//   }, [username, password, usernameError, passwordError]);

//   const handleLogin = async () => {
//     debugger
//     const usernameCheck = validateUsername(username);
//     const passwordCheck = validatePassword(password);

//     setUsernameError(usernameCheck.isValid ? '' : usernameCheck.message);
//     setPasswordError(passwordCheck.isValid ? '' : passwordCheck.message);

//     if (!usernameCheck.isValid || !passwordCheck.isValid) return;

//     try {
//       const payload = {
//         username,
//         password,
//       };
//       const res = await postData('api/auth/client-login', payload);

//       if (res?.status === 1) {
//         await AsyncStorage.setItem(STORAGE_KEYS.cid, String(res?.result?.user?.cid));
//         await AsyncStorage.setItem(STORAGE_KEYS.fhid, String(res?.result?.user?.fhid));
//         await AsyncStorage.setItem(STORAGE_KEYS.levelNo, String(res?.result?.user?.levelNo));
//         await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(res?.result?.user));

//         navigation.navigate('CreatePin', {
//           username,
//           password,
//           apiLoginDone: true,
//         });
//       } else {
//         Alert.alert('Login failed', res?.message || 'Unable to login.');
//       }
//     } catch (error: any) {
//       Alert.alert('Login failed', error?.message || 'Unable to login.');
//     }
//   };

//   return (
//     <KeyboardAwareScrollView
//       contentContainerStyle={styles.container}
//       enableOnAndroid={true}
//       keyboardShouldPersistTaps="handled"
//       extraScrollHeight={Platform.OS === 'ios' ? 30 : 80}
//       showsVerticalScrollIndicator={false}
//     >
//       <LinearGradient
//         colors={['#165CCE', '#1E3696']}
//         start={{ x: 0.5, y: 0 }}
//         end={{ x: 0.5, y: 1 }}
//         style={styles.gradient}
//       >
//         <LoginRupee  style={styles.rupeeIcon} />
//         <View style={styles.topShape} />
//         <View style={styles.card}>
//           <Text style={styles.title}>Login</Text>

//           <View style={styles.formGroup}>
//             <View style={styles.fieldContainer}>
//               <Text style={styles.label}>Username</Text>
//               <View style={[styles.inputBox, usernameFocused ? styles.inputBoxFocused : styles.inputBoxDefault]}>
//                 <Ionicons
//                   name="person-outline"
//                   size={scaleFont(18)}
//                   color="#3B82F6"
//                 />
//                 <TextInput
//                   style={styles.inputFlex}
//                   value={username}
//                   placeholder="Yourname"
//                   placeholderTextColor="#9CA3AF"
//                   onChangeText={(text) => {
//                     setUsername(text);
//                     setUsernameError('');
//                   }}
//                   onFocus={() => setUsernameFocused(true)}
//                   onBlur={() => {
//                     setUsernameFocused(false);
//                     const res = validateUsername(username);
//                     setUsernameError(res.isValid ? '' : res.message);
//                   }}
//                   autoCapitalize="none"
//                 />
//               </View>
//               {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
//             </View>

//             <View style={styles.fieldContainer}>
//               <Text style={styles.label}>Password</Text>
//               <View style={[styles.inputBox, passwordFocused ? styles.inputBoxFocused : styles.inputBoxDefault]}>
//                 <Ionicons
//                   name="lock-closed-outline"
//                   size={scaleFont(18)}
//                   color="#9CA3AF"
//                 />
//                 <TextInput
//                   style={styles.inputFlex}
//                   value={password}
//                   placeholder="Enter Password"
//                   placeholderTextColor="#9CA3AF"
//                   onChangeText={(text) => {
//                     setPassword(text);
//                     setPasswordError('');
//                   }}
//                   onFocus={() => setPasswordFocused(true)}
//                   onBlur={() => {
//                     setPasswordFocused(false);
//                     const res = validatePassword(password);
//                     setPasswordError(res.isValid ? '' : res.message);
//                   }}
//                   secureTextEntry={!showPassword}
//                   autoCapitalize="none"
//                 />
//                 <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                   <Image
//                     source={require('../../images/loginImage/eye.png')}
//                     style={styles.eyeIcon}
//                   />
//                 </TouchableOpacity>
//               </View>
//               {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
//             </View>
//           </View>

//           <TouchableOpacity
//             style={[styles.loginButton, { opacity: isFormValid ? 1 : 0.5 }]}
//             disabled={!isFormValid}
//             onPress={handleLogin}
//           >
//             <Text style={styles.loginButtonText}>Login</Text>
//           </TouchableOpacity>

//           <TouchableOpacity>
//             <Text style={styles.forgotText}>Forgot your password?</Text>
//           </TouchableOpacity>

//           <View style={styles.socialDivider}>
//             <LinearGradient
//               colors={['#165CCE', '#1E3696']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.dividerLine}
//             />
//             <Text style={styles.dividerText}>or continue with</Text>
//             <LinearGradient
//               colors={['#165CCE', '#1E3696']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.dividerLine}
//             />
//           </View>

//           <View style={styles.socialRow}>
//             <TouchableOpacity style={styles.socialButton}>
//               <GoogleIcon width={24} height={24} />
//               <Text style={styles.socialButtonText}>Google</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.socialButton}>
//               <AppleIcon width={19.51} height={19.51} />
//               <Text style={styles.socialButtonText}>Apple</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </LinearGradient>
//     </KeyboardAwareScrollView>
//   );
// };

// export default LoginFlow;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#165CCE',
//   },
//   gradient: {
//     flex: 1,
//     width: '100%',
//     minHeight: hp(844),
//   },
//   topShape: {
//     height: hp(173),
//   },
//   rupeeIcon: {
//     position: 'absolute',
//     top: -10,
//     left: 221,
//     opacity: 1,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     marginTop: hp(30),
//     borderTopLeftRadius: wp(40),
//     borderTopRightRadius: wp(40),
//     paddingHorizontal: wp(18),
//     paddingTop: hp(32),
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: scaleFont(30),
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: hp(32),
//   },
//   formGroup: {
//     width: '100%',
//     gap: hp(16),
//   },
//   fieldContainer: {
//     width: '100%',
//   },
//   label: {
//     fontSize: scaleFont(14),
//     fontWeight: '400',
//     color: '#000000',
//     marginBottom: hp(8),
//   },
//   inputBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: hp(44),
//     borderRadius: wp(22),
//     borderWidth: 1,
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: wp(12),
//     gap: wp(8),
//   },
//   inputBoxDefault: {
//     borderColor: '#D1D5DB',
//   },
//   inputBoxFocused: {
//     borderColor: '#3B82F6',
//   },
//   inputFlex: {
//     flex: 1,
//     fontSize: scaleFont(16),
//     color: '#000000',
//     paddingVertical: 0,
//     ...Platform.select({ android: { includeFontPadding: false } }),
//   },
//   eyeIcon: {
//     width: wp(22),
//     height: wp(22),
//     tintColor: '#6B7280',
//     resizeMode: 'contain',
//   },
//   errorText: {
//     marginTop: hp(4),
//     fontSize: scaleFont(12),
//     color: 'red',
//   },
//   loginButton: {
//     marginTop: hp(24),
//     width: '100%',
//     height: hp(56),
//     backgroundColor: '#165CCE',
//     borderRadius: wp(28),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loginButtonText: {
//     color: '#FFFFFF',
//     fontSize: scaleFont(16),
//     fontWeight: '600',
//   },
//   forgotText: {
//     marginTop: hp(16),
//     textAlign: 'center',
//     color: '#165CCE',
//     fontSize: scaleFont(15),
//     fontWeight: '600',
//     letterSpacing: 0.15,
//   },
//   socialDivider: {
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: hp(32),
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#E5E7EB',
//   },
//   dividerText: {
//     marginHorizontal: wp(12),
//     color: '#6B7280',
//     fontSize: scaleFont(13),
//   },
//   socialRow: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: hp(20),
//     gap: wp(12),
//   },
//   socialButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: hp(52),
//     borderRadius: wp(26),
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     backgroundColor: '#FFFFFF',
//     gap: wp(8),
//   },
//   socialButtonText: {
//     fontSize: scaleFont(15),
//     color: '#111827',
//     marginLeft: wp(8),
//   },
// });


import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Image, // Already imported
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/NavigationType/type';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { wp, hp, scaleFont } from '../../utils/responcive/responcive';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { validateUsername, validatePassword } from '../../utils/validation/validation';
import { usePost } from '../../hooks/usePost';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import GoogleIcon from '../../images/loginImage/google.svg';
import AppleIcon from '../../images/loginImage/apple.svg';
// REMOVED: import LoginRupee from '../../images/loginImage/loginrupee.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginFlow: React.FC<Props> = ({ navigation, route }) => {
  const { postData, loading } = usePost();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isFormValid = useMemo(() => {
    return username.length > 0 && password.length > 0 && !usernameError && !passwordError;
  }, [username, password, usernameError, passwordError]);

  const handleLogin = async () => {
    const usernameCheck = validateUsername(username);
    const passwordCheck = validatePassword(password);

    setUsernameError(usernameCheck.isValid ? '' : usernameCheck.message);
    setPasswordError(passwordCheck.isValid ? '' : passwordCheck.message);

    if (!usernameCheck.isValid || !passwordCheck.isValid) return;

    try {
      const payload = { username, password };
      const res = await postData('api/auth/client-login', payload);

      if (res?.status === 1) {
        await AsyncStorage.setItem(STORAGE_KEYS.cid, String(res?.result?.user?.cid));
        await AsyncStorage.setItem(STORAGE_KEYS.fhid, String(res?.result?.user?.fhid));
        await AsyncStorage.setItem(STORAGE_KEYS.levelNo, String(res?.result?.user?.levelNo));
        await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(res?.result?.user));

        navigation.navigate('CreatePin', {
          username,
          password,
          apiLoginDone: true,
        });
      } else {
        Alert.alert('Login failed', res?.message || 'Unable to login.');
      }
    } catch (error: any) {
      Alert.alert('Login failed', error?.message || 'Unable to login.');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={Platform.OS === 'ios' ? 30 : 80}
      showsVerticalScrollIndicator={false}
    >
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
          <Text style={styles.title}>Login</Text>

          <View style={styles.formGroup}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Username</Text>
              <View style={[styles.inputBox, usernameFocused ? styles.inputBoxFocused : styles.inputBoxDefault]}>
                <Ionicons name="person-outline" size={scaleFont(18)} />
                <TextInput
                  style={styles.inputFlex}
                  value={username}
                  placeholder="Username"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={(text) => {
                    setUsername(text);
                    setUsernameError('');
                  }}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => {
                    setUsernameFocused(false);
                    const res = validateUsername(username);
                    setUsernameError(res.isValid ? '' : res.message);
                  }}
                  autoCapitalize="none"
                />
              </View>
              {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputBox, passwordFocused ? styles.inputBoxFocused : styles.inputBoxDefault]}>
                <Ionicons name="lock-closed-outline" size={scaleFont(18)} />
                <TextInput
                  style={styles.inputFlex}
                  value={password}
                  placeholder="Enter Password"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => {
                    setPasswordFocused(false);
                    const res = validatePassword(password);
                    setPasswordError(res.isValid ? '' : res.message);
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Image
                    source={require('../../images/loginImage/eye.png')}
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, { opacity: isFormValid ? 1 : 0.5 }]}
            disabled={!isFormValid}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot your password?</Text>
          </TouchableOpacity>

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
    </KeyboardAwareScrollView>
  );
};

export default LoginFlow;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#165CCE',
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
    // top: -hp(1), 
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
  },
  title: {
    fontSize: scaleFont(30),
    fontWeight: '700',
    color: '#111827',
    marginBottom: hp(32),
  },
  formGroup: {
    width: '100%',
    gap: hp(16),
  },
  fieldContainer: {
    width: '100%',
  },
  label: {
    fontSize: scaleFont(14),
    fontWeight: '400',
    color: '#000000',
    marginBottom: hp(8),
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(44),
    borderRadius: wp(22),
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(12),
    gap: wp(8),
  },
  inputBoxDefault: {
    borderColor: '#D1D5DB',
  },
  inputBoxFocused: {
    borderColor: '#3B82F6',
  },
  inputFlex: {
    flex: 1,
    fontSize: scaleFont(16),
    color: '#000000',
    paddingVertical: 0,
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  eyeIcon: {
    width: wp(22),
    height: wp(22),
    tintColor: '#6B7280',
    resizeMode: 'contain',
  },
  errorText: {
    marginTop: hp(4),
    fontSize: scaleFont(12),
    color: 'red',
  },
  loginButton: {
    marginTop: hp(24),
    width: '100%',
    height: hp(45),
    backgroundColor: '#165CCE',
    borderRadius: wp(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
  forgotText: {
    marginTop: hp(16),
    textAlign: 'center',
    color: '#165CCE',
    fontSize: scaleFont(12),
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  socialDivider: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(90),
  },
  dividerLine: {
    width: wp(114),
    height: 1,
    borderTopWidth: 1,
  },
  dividerLineLeft: {
    borderTopColor: '#165CCE',
  },
  dividerLineRight: {
    borderTopColor: '#1E3696',
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
    marginTop: hp(20),
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
