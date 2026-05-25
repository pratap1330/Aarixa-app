import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Image,
    ScrollView,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/NavigationType/type';
import { usePost } from '../../hooks/usePost';
import * as Keychain from 'react-native-keychain';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import {
    enableBiometricLoginWithVerification,
    getBiometricStatus,
} from '../../services/biometric/biometricService';
import GoogleIcon from '../../images/loginImage/google.svg';
import AppleIcon from '../../images/loginImage/apple.svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const wp = (size: number) => (SCREEN_WIDTH / 375) * size;
const hp = (size: number) => (SCREEN_HEIGHT / 812) * size;
const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePin'>;

const CreatePinScreen: React.FC<Props> = ({ navigation, route }) => {
    const { postData, loading } = usePost();
    const { username, password, otp, phone, apiLoginDone } = route.params;
    const [pin, setPin] = useState(Array(4).fill(''));
    const inputRefs = useRef<TextInput[]>([]);

    const handleChange = (text: string, index: number) => {
        if (text && !/^\d$/.test(text)) return;

        const newPin = [...pin];
        newPin[index] = text;
        setPin(newPin);

        if (text) {
            if (index < pin.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        } else {
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleSetPin = async () => {
        const finalPin = pin.join('');

        if (finalPin.length !== 4) return;
        try {
            if (!apiLoginDone) {
                const payload: any = {
                    username,
                    password,
                    Passcode: finalPin,
                };

                if (otp) payload.otp = otp;
                if (phone) payload.phone = phone;
                const res = await postData("api/auth/client-login", payload);
                if (res?.status === 1) {
                    await AsyncStorage.setItem(STORAGE_KEYS.cid, String(res?.result?.user?.cid));
                    await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(res?.result?.user));
                } else {
                    Alert.alert(res?.message || 'Login failed');
                    return;
                }
            }

            await Keychain.setGenericPassword(username, password);
            await AsyncStorage.setItem(STORAGE_KEYS.userPin, finalPin);

            const biometricStatus = await getBiometricStatus();

            if (!biometricStatus.available) {
                navigation.navigate("AllSet");
                return;
            }

            Alert.alert(
                `${biometricStatus.label} login`,
                `Do you want to enable ${biometricStatus.label} for faster and secure login next time?`,
                [
                    {
                        text: "Maybe Later",
                        style: "cancel",
                        onPress: () => navigation.navigate("AllSet"),
                    },
                    {
                        text: "Enable",
                        onPress: async () => {
                            try {
                                const isEnabled = await enableBiometricLoginWithVerification(
                                    `Confirm ${biometricStatus.label} to enable quick login`,
                                );

                                if (!isEnabled) {
                                    Alert.alert(
                                        "Setup cancelled",
                                        `${biometricStatus.label} login was not enabled.`,
                                    );
                                }
                            } catch {
                                Alert.alert(
                                    "Biometric setup failed",
                                    `We could not enable ${biometricStatus.label} right now.`,
                                );
                            } finally {
                                navigation.navigate("AllSet");
                            }
                        },
                    },
                ],
            );

        } catch (err: any) {
            Alert.alert(err?.message);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
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
                        <Text style={styles.title}>Create New PIN</Text>

                        <Text style={styles.subtitle}>
                            Set a 4-digit PIN for quick and safe access.
                        </Text>

                        <View style={styles.pinRow}>
                            {pin.map((value, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => {
                                        if (ref) inputRefs.current[index] = ref;
                                    }}
                                    style={styles.pinInput}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    secureTextEntry
                                    value={value}
                                    onChangeText={(text) =>
                                        handleChange(text, index)
                                    }
                                    onKeyPress={({ nativeEvent }) => {
                                        if (
                                            nativeEvent.key === 'Backspace' &&
                                            !pin[index] &&
                                            index > 0
                                        ) {
                                            inputRefs.current[index - 1]?.focus();
                                        }
                                    }}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                { opacity: pin.join('').length === 4 ? 1 : 0.5 }
                            ]}
                            disabled={pin.join('').length < 4}
                            onPress={handleSetPin}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Please wait..." : "Set PIN"}
                            </Text>
                        </TouchableOpacity>

                        {/* <View style={styles.socialDivider}>
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
                        </View> */}

                        {/* <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialButton}>
                                <GoogleIcon width={24} height={24} />
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <AppleIcon width={19.51} height={19.51} />
                                <Text style={styles.socialButtonText}>Apple</Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </LinearGradient>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CreatePinScreen;

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
        minHeight: hp(810),
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
        marginBottom: hp(35),
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
        fontSize: scaleFont(18),
        fontWeight: '600',
        color: '#111827',
        backgroundColor: '#FFFFFF',
    },
    button: {
        width: '100%',
        height: hp(45),
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
    socialDivider: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(90),
        marginBottom: hp(20),
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


// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
//   Animated,
//   StatusBar,
//   Easing,
//   KeyboardAvoidingView,
//   Alert,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../utils/NavigationType/type';
// import { usePost } from '../../hooks/usePost';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
// import { wp, hp, scaleFont } from '../../utils/responcive/responcive';

// type Props = NativeStackScreenProps<RootStackParamList, 'CreatePin'>;

// // ─── TOKENS (same across Login → OTP → PIN) ───────────────────────────────────
// const C = {
//   blue0:   '#1847CC',
//   blue1:   '#1238A8',
//   blue2:   '#0A1F6E',
//   dark0:   '#060D2E',
//   dark1:   '#04091E',
//   darkest: '#020510',
//   accent:  '#6BA3FF',
//   green:   '#16A34A',
//   white:   '#FFFFFF',
//   muted:   'rgba(255,255,255,0.35)',
//   hint:    'rgba(255,255,255,0.18)',
// };

// // ─── Ambient Blob ─────────────────────────────────────────────────────────────
// const Blob: React.FC<{ style: object; color: string; size: number }> = ({ style, color, size }) => {
//   const pulse = useRef(new Animated.Value(0)).current;
//   useEffect(() => {
//     Animated.loop(Animated.sequence([
//       Animated.timing(pulse, { toValue: 1, duration: 5000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//       Animated.timing(pulse, { toValue: 0, duration: 5000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//     ])).start();
//   }, []);
//   const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.22] });
//   return (
//     <Animated.View style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity }, style]}
//       pointerEvents="none" />
//   );
// };

// // ─── PIN Dot Box ──────────────────────────────────────────────────────────────
// const PinBox: React.FC<{ state: 'empty' | 'active' | 'filled'; index: number }> = ({ state }) => {
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const borderAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (state === 'filled') {
//       Animated.sequence([
//         Animated.timing(scaleAnim, { toValue: 1.1, duration: 80, useNativeDriver: true }),
//         Animated.timing(scaleAnim, { toValue: 1,   duration: 80, useNativeDriver: true }),
//       ]).start();
//     }
//     Animated.timing(borderAnim, {
//       toValue: state === 'active' ? 1 : 0,
//       duration: 180, useNativeDriver: false,
//     }).start();
//   }, [state]);

//   const borderColor = borderAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [
//       state === 'filled' ? 'rgba(107,163,255,0.45)' : 'rgba(255,255,255,0.08)',
//       C.accent,
//     ],
//   });

//   const bgColor = borderAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [
//       state === 'filled' ? 'rgba(107,163,255,0.08)' : 'rgba(255,255,255,0.04)',
//       'rgba(107,163,255,0.1)',
//     ],
//   });

//   return (
//     <Animated.View style={[
//       pin.box,
//       { borderColor, backgroundColor: bgColor, transform: [{ scale: scaleAnim }] },
//       state === 'active' && {
//         shadowColor: C.accent, shadowOffset: { width: 0, height: 0 },
//         shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
//       },
//     ]}>
//       {state === 'filled' && <View style={pin.dot} />}
//       {state === 'active' && <View style={pin.cursor} />}
//     </Animated.View>
//   );
// };

// const pin = StyleSheet.create({
//   box: {
//     width: wp(64), height: wp(64), borderRadius: wp(14),
//     borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
//   },
//   dot: {
//     width: wp(14), height: wp(14), borderRadius: wp(7),
//     backgroundColor: C.accent,
//     shadowColor: C.accent, shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.7, shadowRadius: 8,
//   },
//   cursor: {
//     width: 2, height: hp(28), backgroundColor: C.accent, borderRadius: 1,
//   },
// });

// // ─── Keypad Key ───────────────────────────────────────────────────────────────
// const Key: React.FC<{
//   label: string | React.ReactNode;
//   onPress: () => void;
//   variant?: 'number' | 'delete' | 'empty';
// }> = ({ label, onPress, variant = 'number' }) => {
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const bgAnim    = useRef(new Animated.Value(0)).current;

//   if (variant === 'empty') return <View style={key.empty} />;

//   const onPressIn = () => {
//     Animated.parallel([
//       Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true }),
//       Animated.timing(bgAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
//     ]).start();
//   };

//   const onPressOut = () => {
//     Animated.parallel([
//       Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
//       Animated.timing(bgAnim, { toValue: 0, duration: 150, useNativeDriver: false }),
//     ]).start();
//   };

//   const bgColor = bgAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['rgba(255,255,255,0.04)', 'rgba(107,163,255,0.15)'],
//   });

//   const borderColor = bgAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['rgba(255,255,255,0.07)', 'rgba(107,163,255,0.35)'],
//   });

//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       onPressIn={onPressIn}
//       onPressOut={onPressOut}
//       activeOpacity={1}
//     >
//       <Animated.View style={[key.base, { backgroundColor: bgColor, borderColor, transform: [{ scale: scaleAnim }] }]}>
//         {typeof label === 'string' ? (
//           <Text style={variant === 'delete' ? key.deleteTxt : key.numTxt}>{label}</Text>
//         ) : (
//           label
//         )}
//       </Animated.View>
//     </TouchableOpacity>
//   );
// };

// const key = StyleSheet.create({
//   base: {
//     width: '100%', height: hp(56), borderRadius: wp(14),
//     borderWidth: 1, alignItems: 'center', justifyContent: 'center',
//   },
//   numTxt:    { fontSize: scaleFont(22), fontWeight: '700', color: C.white },
//   deleteTxt: { fontSize: scaleFont(16), color: 'rgba(255,255,255,0.5)' },
//   empty:     { width: '100%', height: hp(56) },
// });

// // ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
// const CreatePinScreen: React.FC<Props> = ({ navigation, route }) => {
//   const { postData, loading } = usePost();
//   const { username, password, otp } = route.params;
//   const [pinDigits, setPinDigits] = useState<string[]>([]);
//   const [success, setSuccess]     = useState(false);

//   // Entrance animations
//   const topOp  = useRef(new Animated.Value(0)).current;
//   const topY   = useRef(new Animated.Value(hp(-20))).current;
//   const formOp = useRef(new Animated.Value(0)).current;
//   const formY  = useRef(new Animated.Value(hp(24))).current;
//   const btnSc  = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     Animated.stagger(140, [
//       Animated.parallel([
//         Animated.timing(topOp, { toValue: 1, duration: 650, useNativeDriver: true }),
//         Animated.timing(topY,  { toValue: 0, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
//       ]),
//       Animated.parallel([
//         Animated.timing(formOp, { toValue: 1, duration: 600, useNativeDriver: true }),
//         Animated.timing(formY,  { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
//       ]),
//     ]).start();
//   }, []);

//   const isComplete = pinDigits.length === 4;

//   const handlePress = (digit: string) => {
//     if (pinDigits.length >= 4) return;
//     setPinDigits(prev => [...prev, digit]);
//   };

//   const handleDelete = () => {
//     setPinDigits(prev => prev.slice(0, -1));
//   };

//   const handleSetPin = async () => {
//     if (!isComplete) return;
//     const finalPin = pinDigits.join('');
//     try {
//       const payload = { username, Password: password, Passcode: finalPin, otp };
//       const res = await postData('api/auth/client-login', payload);
//       if (res?.status === 1) {
//         await AsyncStorage.setItem('cid', res?.result?.user?.cid);
//         await AsyncStorage.setItem('user', JSON.stringify(res?.result?.user));
//         setSuccess(true);
//         setTimeout(() => navigation.navigate('AllSet'), 800);
//       } else {
//         Alert.alert('Error', res?.message);
//       }
//     } catch (err: any) {
//       Alert.alert('Error', err?.message);
//     }
//   };

//   const onPressIn  = () => Animated.spring(btnSc, { toValue: 0.96, useNativeDriver: true }).start();
//   const onPressOut = () => Animated.spring(btnSc, { toValue: 1, friction: 4, useNativeDriver: true }).start();

//   // Determine each box state
//   const getBoxState = (i: number): 'empty' | 'active' | 'filled' => {
//     if (i < pinDigits.length) return 'filled';
//     if (i === pinDigits.length && pinDigits.length < 4) return 'active';
//     return 'empty';
//   };

//   return (
//     <>
//       <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

//       <LinearGradient
//         colors={[C.blue0, C.blue1, C.blue2, C.dark0, C.dark1, C.darkest]}
//         locations={[0, 0.14, 0.30, 0.52, 0.72, 1]}
//         start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}
//         style={s.root}
//       >
//         <Blob size={wp(380)} color="#3B6FFF" style={{ top: hp(-160), left: wp(-120) }} />
//         <Blob size={wp(260)} color="#4090FF" style={{ top: hp(60), right: wp(-100) }} />
//         <Blob size={wp(200)} color="#2050CC" style={{ bottom: hp(80), left: wp(-60) }} />

//         <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//           <View style={s.inner}>

//             {/* Back */}
//             <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
//               <Ionicons name="arrow-back" size={scaleFont(18)} color="rgba(255,255,255,0.7)" />
//             </TouchableOpacity>

//             {/* ── Top section ── */}
//             <Animated.View style={[s.topSection, { opacity: topOp, transform: [{ translateY: topY }] }]}>
//               <LinearGradient
//                 colors={['rgba(26,71,204,0.5)', 'rgba(10,31,110,0.7)']}
//                 style={s.iconBox}
//               >
//                 <Ionicons name="lock-closed-outline" size={scaleFont(32)} color={C.accent} />
//               </LinearGradient>

//               <View style={s.badge}>
//                 <View style={s.badgeDot} />
//                 <Text style={s.badgeTxt}>SECURITY SETUP</Text>
//               </View>

//               <Text style={s.headline}>
//                 Create your{'\n'}
//                 <Text style={s.headlineAccent}>secret PIN.</Text>
//               </Text>
//               <Text style={s.subline}>
//                 Set a 4-digit PIN for quick and{'\n'}safe access to your account.
//               </Text>
//             </Animated.View>

//             {/* ── PIN + Keypad ── */}
//             <Animated.View style={[s.formSection, { opacity: formOp, transform: [{ translateY: formY }] }]}>

//               {/* PIN boxes */}
//               <View style={s.pinRow}>
//                 {[0, 1, 2, 3].map(i => (
//                   <PinBox key={i} index={i} state={getBoxState(i)} />
//                 ))}
//               </View>

//               {/* Custom keypad */}
//               <View style={s.keypad}>
//                 {['1','2','3','4','5','6','7','8','9'].map(d => (
//                   <Key key={d} label={d} onPress={() => handlePress(d)} />
//                 ))}
//                 <Key label="" onPress={() => {}} variant="empty" />
//                 <Key label="0" onPress={() => handlePress('0')} />
//                 <Key
//                   variant="delete"
//                   onPress={handleDelete}
//                   label={
//                     <Ionicons name="backspace-outline" size={scaleFont(20)} color="rgba(255,255,255,0.5)" />
//                   }
//                 />
//               </View>

//               {/* Set PIN button */}
//               <Animated.View style={{ transform: [{ scale: btnSc }] }}>
//                 <TouchableOpacity
//                   activeOpacity={0.9}
//                   disabled={!isComplete || loading}
//                   onPress={handleSetPin}
//                   onPressIn={onPressIn}
//                   onPressOut={onPressOut}
//                 >
//                   {success ? (
//                     <LinearGradient
//                       colors={['#166534', '#16A34A']}
//                       start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//                       style={s.btn}
//                     >
//                       <Text style={s.btnTxtOn}>PIN Set ✓</Text>
//                     </LinearGradient>
//                   ) : isComplete ? (
//                     <LinearGradient
//                       colors={[C.blue1, C.blue0, '#2563EB']}
//                       start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//                       style={s.btn}
//                     >
//                       <Text style={s.btnTxtOn}>
//                         {loading ? 'Please wait…' : 'Set PIN'}
//                       </Text>
//                       {!loading && (
//                         <View style={s.btnArrow}>
//                           <Ionicons name="arrow-forward" size={scaleFont(14)} color={C.blue0} />
//                         </View>
//                       )}
//                     </LinearGradient>
//                   ) : (
//                     <View style={[s.btn, s.btnOff]}>
//                       <Text style={s.btnTxtOff}>Set PIN</Text>
//                       <View style={[s.btnArrow, s.btnArrowOff]}>
//                         <Ionicons name="arrow-forward" size={scaleFont(14)} color="rgba(255,255,255,0.15)" />
//                       </View>
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               </Animated.View>

//               <Text style={s.hint}>
//                 Your PIN is encrypted and never stored in plain text
//               </Text>
//             </Animated.View>

//           </View>
//         </KeyboardAvoidingView>
//       </LinearGradient>
//     </>
//   );
// };

// export default CreatePinScreen;

// // ─── STYLES ───────────────────────────────────────────────────────────────────
// const s = StyleSheet.create({
//   root:  { flex: 1 },
//   inner: { flex: 1, paddingHorizontal: wp(28), paddingBottom: hp(24) },

//   backBtn: {
//     marginTop: Platform.OS === 'ios' ? hp(58) : hp(44),
//     marginBottom: hp(22),
//     width: wp(40), height: wp(40), borderRadius: wp(12),
//     backgroundColor: 'rgba(255,255,255,0.05)',
//     borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
//     alignItems: 'center', justifyContent: 'center',
//     alignSelf: 'flex-start',
//   },

//   topSection: { marginBottom: hp(28) },

//   iconBox: {
//     width: wp(72), height: wp(72), borderRadius: wp(22),
//     borderWidth: 1, borderColor: 'rgba(107,163,255,0.2)',
//     alignItems: 'center', justifyContent: 'center',
//     marginBottom: hp(18),
//   },

//   badge: {
//     flexDirection: 'row', alignItems: 'center', gap: wp(6),
//     alignSelf: 'flex-start',
//     backgroundColor: 'rgba(107,163,255,0.08)',
//     borderWidth: 1, borderColor: 'rgba(107,163,255,0.2)',
//     borderRadius: wp(20), paddingHorizontal: wp(12), paddingVertical: hp(5),
//     marginBottom: hp(14),
//   },
//   badgeDot: {
//     width: wp(6), height: wp(6), borderRadius: wp(3), backgroundColor: C.accent,
//     shadowColor: C.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 6,
//   },
//   badgeTxt: { fontSize: scaleFont(9.5), color: 'rgba(107,163,255,0.9)', fontWeight: '700', letterSpacing: 0.8 },

//   headline: {
//     fontSize: scaleFont(32), fontWeight: '800', color: C.white,
//     lineHeight: scaleFont(38), letterSpacing: -0.5, marginBottom: hp(10),
//   },
//   headlineAccent: { color: C.accent },
//   subline: { fontSize: scaleFont(13), color: C.muted, lineHeight: scaleFont(22) },

//   formSection: {},

//   // PIN row
//   pinRow: {
//     flexDirection: 'row', justifyContent: 'space-between',
//     marginBottom: hp(28),
//   },

//   // Keypad grid
//   keypad: {
//     flexDirection: 'row', flexWrap: 'wrap',
//     gap: wp(10), marginBottom: hp(22),
//   },

//   // Button
//   btn: {
//     height: hp(52), borderRadius: wp(12),
//     flexDirection: 'row', alignItems: 'center',
//     justifyContent: 'center', paddingHorizontal: wp(20),
//   },
//   btnOff: {
//     backgroundColor: 'rgba(255,255,255,0.04)',
//     borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
//   },
//   btnTxtOn:  { flex: 1, textAlign: 'center', fontSize: scaleFont(15), fontWeight: '700', color: C.white, letterSpacing: 0.3, marginLeft: wp(28) },
//   btnTxtOff: { flex: 1, textAlign: 'center', fontSize: scaleFont(15), fontWeight: '700', color: 'rgba(255,255,255,0.2)', letterSpacing: 0.3, marginLeft: wp(28) },
//   btnArrow:    { width: wp(28), height: wp(28), borderRadius: wp(8), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
//   btnArrowOff: { backgroundColor: 'rgba(255,255,255,0.04)' },

//   hint: {
//     textAlign: 'center', marginTop: hp(12),
//     fontSize: scaleFont(10.5), color: 'rgba(255,255,255,0.18)', lineHeight: scaleFont(18),
//   },
// });
