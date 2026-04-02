// import React, { useState, useRef } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     Image,
//     TextInput,
//     TouchableOpacity,
//     Dimensions,
//     KeyboardAvoidingView,
//     Platform,
// } from 'react-native';

// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../utils/NavigationType/type';

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

// type Props = NativeStackScreenProps<RootStackParamList, 'OTPVerification'>;

// const OtpVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
//     const { username, password } = route.params;
//     const [otp, setOtp] = useState(Array(4).fill(''));
//     const inputRefs = useRef<TextInput[]>([]);
//     const isOtpComplete = otp.every(digit => digit !== '');
//     const handleChange = (text: string, index: number) => {
//         const newOtp = [...otp];

//         // Only allow 0-9
//         if (text && !/^\d$/.test(text)) return;

//         // Replace current digit
//         newOtp[index] = text;
//         setOtp(newOtp);

//         if (text) {
//             // Always move forward if a digit is entered
//             if (index < otp.length - 1) {
//                 inputRefs.current[index + 1]?.focus();
//             }
//         } else {
//             // Move back if input is cleared
//             if (index > 0) {
//                 inputRefs.current[index - 1]?.focus();
//             }
//         }
//     };

//     // const verfiyotp = () => {
//     //     navigation.navigate('CreatePin');

//     // }

//     const verfiyotp = () => {
//         const finalOtp = otp.join('');

//         navigation.navigate('CreatePin', {
//             username,
//             password,
//             otp: finalOtp,
//         });
//     };

//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//             style={styles.container}
//         >
//             {/* 🔙 Back Button */}
//             <TouchableOpacity
//                 style={styles.backButton}
//                 onPress={() => navigation.goBack()}
//             >
//                 <Image
//                     source={require('../../images/loginImage/back.png')}
//                     style={styles.backIcon}
//                     resizeMode="contain"
//                 />
//             </TouchableOpacity>

//             {/* Title */}
//             <Text style={styles.title}>OTP Verification</Text>

//             {/* Image */}
//             <Image
//                 source={require('../../images/loginImage/otp.png')}
//                 style={styles.image}
//                 resizeMode="contain"
//             />

//             {/* Subtitle */}
//             <Text style={styles.subtitle}>
//                 Enter the verification code you received 
//             </Text>

//             {/* Phone */}
//             {/* <View style={styles.phoneContainer}>
//                 <Image
//                     source={require('../../images/loginImage/india.png')}
//                     style={styles.flag}
//                     resizeMode="contain"
//                 />
//                 <Text style={styles.phoneText}>+91 98765 43210</Text>
//             </View> */}

//             {/* OTP Inputs */}
//             <View style={styles.otpContainer}>
//                 {otp.map((value, index) => (
//                     <TextInput
//                         key={index}
//                         ref={(ref) => {
//                             if (ref) inputRefs.current[index] = ref;
//                         }}
//                         style={styles.otpInput}
//                         keyboardType="number-pad"
//                         maxLength={1}
//                         value={value}
//                         onChangeText={(text) => handleChange(text, index)}
//                         onKeyPress={({ nativeEvent }) => {
//                             if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
//                                 inputRefs.current[index - 1]?.focus();
//                             }
//                         }}
//                         autoFocus={index === 0}  // only first box auto-focused
//                     />
//                 ))}
//             </View>

//             {/* Verify Button */}
//             {/* <TouchableOpacity style={styles.button}
//                 onPress={verfiyotp}>
//                 <Text
//                     style={styles.buttonText}>Verify</Text>
//             </TouchableOpacity> */}

//             <TouchableOpacity
//                 style={[
//                     styles.button,
//                     { opacity: isOtpComplete ? 1 : 0.5 }
//                 ]}
//                 disabled={!isOtpComplete}
//                 onPress={verfiyotp}
//             >
//                 <Text style={styles.buttonText}>Verify</Text>
//             </TouchableOpacity>

//             {/* Resend */}
//             <TouchableOpacity style={styles.resendButton}>
//                 <Text style={styles.resendText}>
//                     Didn’t receive code?{' '}
//                     <Text style={styles.resendLink}>Resend</Text>
//                 </Text>
//             </TouchableOpacity>
//         </KeyboardAvoidingView>
//     );
// };

// export default OtpVerificationScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         paddingTop: SCREEN_HEIGHT * 0.1,
//     },

//     /* 🔙 Back Button Style */
//     backButton: {
//         position: 'absolute',
//         top: 59,
//         left: 16,
//         width: 41,
//         height: 41,

//         justifyContent: 'center',
//         alignItems: 'center',

//         // borderWidth: 1,
//         borderColor: '#E8ECF4',
//         borderStyle: 'solid',

//         // borderRadius: 12, // 👈 optional (Figma me rounded hai to rakhna)
//         backgroundColor: '#fff', // 👈 clean look
//     },

//     backIcon: {
//         width: 38,   // 42px ~ 11% of 375px width
//         height: 38,
//         borderRadius: 12,
//         // keep it square
//         resizeMode: 'contain',
//     },
//     // backIcon: {
//     //     width: SCREEN_WIDTH * 0.11,   // 42px ~ 11% of 375px width
//     //     height: SCREEN_WIDTH * 0.11,  // keep it square
//     //     // resizeMode: 'contain',
//     // },
//     title: {
//         width: SCREEN_WIDTH * 0.7,
//         fontFamily: 'Urbanist-SemiBold',
//         // fontWeight: '700',
//         fontSize: scaleFont(30),
//         lineHeight: scaleFont(38),
//         letterSpacing: -1,
//         color: '#1E232C',
//         textAlign: 'center',
//         marginBottom: SCREEN_HEIGHT * 0.02,
//     },

//     image: {
//         width: SCREEN_WIDTH * 0.25,
//         height: SCREEN_WIDTH * 0.28,
//         marginBottom: SCREEN_HEIGHT * 0.04,
//     },

//     subtitle: {
//         // width: SCREEN_WIDTH * (304 / 375),
//         fontFamily: 'Urbanist-Medium',
//         // fontWeight: '500',
//         fontSize: scaleFont(16),
//         lineHeight: scaleFont(24),
//         color: '#838BA1',
//         textAlign: 'center',
//         // marginBottom: SCREEN_HEIGHT * 0.00005,
//     },

//     phoneContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: SCREEN_WIDTH * 0.02,
//         marginBottom: SCREEN_HEIGHT * 0.015,
//     },

//     flag: {
//         width: SCREEN_WIDTH * (25 / 375),
//         height: SCREEN_WIDTH * (25 / 375),
//     },

//     phoneText: {
//         fontFamily: 'Urbanist-Medium',
//         fontSize: scaleFont(16),
//         color: '#838BA1',
//     },

//     otpContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         fontFamily: 'Urbanist-Medium',
//         width: SCREEN_WIDTH * 0.9,
//         marginBottom: SCREEN_HEIGHT * 0.05,
//     },

//     otpInput: {
//         width: SCREEN_WIDTH * 0.18,
//         height: SCREEN_WIDTH * 0.12,
//         borderColor: '#2288FD',
//         fontFamily: 'Urbanist-SemiBold',
//         borderBottomWidth: 2,
//         textAlign: 'center',
//         fontSize: scaleFont(16),
//         color: '#1E232C',
//     },

//     button: {
//         width: SCREEN_WIDTH * 0.9,
//         height: SCREEN_HEIGHT * 0.065,
//         backgroundColor: '#2288FD',
//         borderRadius: SCREEN_WIDTH * 0.03,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

//     buttonText: {
//         fontFamily: 'Urbanist-Medium',
//         // fontWeight: '700',
//         fontSize: scaleFont(16),
//         color: '#FFFFFF',
//     },

//     resendButton: {
//         marginTop: SCREEN_HEIGHT * 0.015,
//     },

//     resendText: {
//         fontFamily: 'Urbanist-Medium',
//         // fontWeight: '600',
//         fontSize: scaleFont(15),
//         color: '#1E232C',
//         textAlign: 'center',
//     },

//     resendLink: {
//         color: '#2288FD',
//     },
// });


import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Animated,
  StatusBar,
  Easing,
  KeyboardAvoidingView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/NavigationType/type';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp, scaleFont } from '../../utils/responcive/responcive';

type Props = NativeStackScreenProps<RootStackParamList, 'OTPVerification'>;

// ─── TOKENS (same as Login) ───────────────────────────────────────────────────
const C = {
  blue0:    '#1847CC',
  blue1:    '#1238A8',
  blue2:    '#0A1F6E',
  dark0:    '#060D2E',
  dark1:    '#04091E',
  darkest:  '#020510',
  accent:   '#6BA3FF',
  green:    '#4ADE80',
  greenDark:'#16A34A',
  white:    '#FFFFFF',
  muted:    'rgba(255,255,255,0.35)',
  hint:     'rgba(255,255,255,0.18)',
};

// ─── Ambient Blob ─────────────────────────────────────────────────────────────
const Blob: React.FC<{ style: object; color: string; size: number }> = ({ style, color, size }) => {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 5000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 5000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
  }, []);
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.22] });
  return (
    <Animated.View style={[{ position:'absolute', width:size, height:size, borderRadius:size/2, backgroundColor:color, opacity }, style]}
      pointerEvents="none" />
  );
};

// ─── Single OTP Box ───────────────────────────────────────────────────────────
interface OtpBoxProps {
  value: string;
  isFocused: boolean;
  isComplete: boolean;
}

const OtpBox: React.FC<OtpBoxProps> = ({ value, isFocused, isComplete }) => {
  const borderAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200, useNativeDriver: false,
    }).start();
  }, [isFocused]);

  useEffect(() => {
    if (value) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.08, duration: 80, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1,    duration: 80, useNativeDriver: true }),
      ]).start();
    }
  }, [value]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      isComplete ? 'rgba(107,163,255,0.5)' : 'rgba(255,255,255,0.08)',
      C.accent,
    ],
  });

  const bgColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      isComplete ? 'rgba(107,163,255,0.07)' : 'rgba(255,255,255,0.04)',
      'rgba(107,163,255,0.1)',
    ],
  });

  return (
    <Animated.View style={[s.otpBox, {
      borderColor,
      backgroundColor: bgColor,
      transform: [{ scale: scaleAnim }],
      shadowColor: isFocused ? C.accent : 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: isFocused ? 0.3 : 0,
      shadowRadius: 12,
      elevation: isFocused ? 6 : 0,
    }]}>
      {value ? (
        <Text style={s.otpDigit}>{value}</Text>
      ) : isFocused ? (
        <View style={s.cursor} />
      ) : null}
    </Animated.View>
  );
};

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
const OtpVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { username, password } = route.params;
  const [otp, setOtp]           = useState(['', '', '', '']);
  const [focusedIdx, setFocused] = useState(0);
  const [timeLeft, setTimeLeft]  = useState(30);
  const [verified, setVerified]  = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  // Entrance animations
  const topOp  = useRef(new Animated.Value(0)).current;
  const topY   = useRef(new Animated.Value(hp(-20))).current;
  const formOp = useRef(new Animated.Value(0)).current;
  const formY  = useRef(new Animated.Value(hp(24))).current;
  const btnSc  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(140, [
      Animated.parallel([
        Animated.timing(topOp, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(topY,  { toValue: 0, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(formOp, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(formY,  { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const isComplete = otp.every(d => d !== '');

  const handleChange = (text: string, index: number) => {
    if (text && !/^\d$/.test(text)) return;
    const next = [...otp];
    next[index] = text;
    setOtp(next);
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
      setFocused(index + 1);
    }
    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocused(index - 1);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const next = [...otp];
      next[index - 1] = '';
      setOtp(next);
      inputRefs.current[index - 1]?.focus();
      setFocused(index - 1);
    }
  };

  const handleVerify = () => {
    if (!isComplete) return;
    setVerified(true);
    setTimeout(() => {
      navigation.navigate('CreatePin', { username, password, otp: otp.join('') });
    }, 800);
  };

  const handleResend = () => {
    if (timeLeft > 0) return;
    setOtp(['', '', '', '']);
    setFocused(0);
    setTimeLeft(30);
    inputRefs.current[0]?.focus();
  };

  const onPressIn  = () => Animated.spring(btnSc, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(btnSc, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  const timerLabel = `0:${String(timeLeft).padStart(2, '0')}`;

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={[C.blue0, C.blue1, C.blue2, C.dark0, C.dark1, C.darkest]}
        locations={[0, 0.14, 0.30, 0.52, 0.72, 1]}
        start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}
        style={s.root}
      >
        {/* Ambient blobs */}
        <Blob size={wp(380)} color="#3B6FFF" style={{ top: hp(-160), left: wp(-120) }} />
        <Blob size={wp(260)} color="#4090FF" style={{ top: hp(60), right: wp(-100) }} />
        <Blob size={wp(200)} color="#2050CC" style={{ bottom: hp(80), left: wp(-60) }} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={s.inner}>

            {/* ── Back button ── */}
            <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={scaleFont(18)} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>

            {/* ── Top section ── */}
            <Animated.View style={[s.topSection, { opacity: topOp, transform: [{ translateY: topY }] }]}>

              {/* Lock icon box */}
              <LinearGradient
                colors={['rgba(26,71,204,0.5)', 'rgba(10,31,110,0.7)']}
                style={s.iconBox}
              >
                <Ionicons name="shield-checkmark-outline" size={scaleFont(32)} color={C.accent} />
              </LinearGradient>

              {/* Badge */}
              <View style={s.badge}>
                <View style={s.badgeDot} />
                <Text style={s.badgeTxt}>VERIFICATION REQUIRED</Text>
              </View>

              <Text style={s.headline}>
                Enter your{'\n'}
                <Text style={s.headlineAccent}>4-digit code.</Text>
              </Text>

              <Text style={s.subline}>
                We've sent a verification code to{'\n'}
                <Text style={s.sublineStrong}>your registered email / mobile</Text>
              </Text>
            </Animated.View>

            {/* ── OTP + Button ── */}
            <Animated.View style={[s.formSection, { opacity: formOp, transform: [{ translateY: formY }] }]}>

              {/* OTP boxes */}
              <View style={s.otpRow}>
                {otp.map((digit, i) => (
                  <View key={i} style={{ flex: 1 }}>
                    <OtpBox
                      value={digit}
                      isFocused={focusedIdx === i}
                      isComplete={digit !== ''}
                    />
                    <TextInput
                      ref={ref => { if (ref) inputRefs.current[i] = ref; }}
                      style={s.hiddenInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={text => handleChange(text, i)}
                      onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                      onFocus={() => setFocused(i)}
                      autoFocus={i === 0}
                      caretHidden
                    />
                  </View>
                ))}
              </View>

              {/* Verify button */}
              <Animated.View style={{ transform: [{ scale: btnSc }] }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  disabled={!isComplete}
                  onPress={handleVerify}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                >
                  {verified ? (
                    <LinearGradient
                      colors={['#166534', '#16A34A']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={s.btn}
                    >
                      <Text style={s.btnTxtOn}>Verified ✓</Text>
                    </LinearGradient>
                  ) : isComplete ? (
                    <LinearGradient
                      colors={[C.blue1, C.blue0, '#2563EB']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={s.btn}
                    >
                      <Text style={s.btnTxtOn}>Verify OTP</Text>
                      <View style={s.btnArrow}>
                        <Ionicons name="arrow-forward" size={scaleFont(14)} color={C.blue0} />
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={[s.btn, s.btnOff]}>
                      <Text style={s.btnTxtOff}>Verify OTP</Text>
                      <View style={[s.btnArrow, s.btnArrowOff]}>
                        <Ionicons name="arrow-forward" size={scaleFont(14)} color="rgba(255,255,255,0.15)" />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>

              {/* Resend + Timer */}
              <TouchableOpacity style={s.resendRow} onPress={handleResend} disabled={timeLeft > 0}>
                <Text style={s.resendTxt}>
                  Didn't receive the code?{' '}
                  <Text style={[s.resendLink, timeLeft > 0 && s.resendDisabled]}>
                    Resend OTP
                  </Text>
                </Text>
              </TouchableOpacity>

              {timeLeft > 0 && (
                <View style={s.timerRow}>
                  <View style={s.timerRing}>
                    <Text style={s.timerRingTxt}>{timeLeft}</Text>
                  </View>
                  <Text style={s.timerTxt}>
                    Resend in{' '}
                    <Text style={s.timerVal}>{timerLabel}</Text>
                  </Text>
                </View>
              )}

            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
};

export default OtpVerificationScreen;

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:  { flex: 1 },
  inner: { flex: 1, paddingHorizontal: wp(28), paddingBottom: hp(32) },

  backBtn: {
    marginTop: Platform.OS === 'ios' ? hp(58) : hp(44),
    marginBottom: hp(24),
    width: wp(40), height: wp(40), borderRadius: wp(12),
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'flex-start',
  },

  // ── Top ──
  topSection: { marginBottom: hp(36) },

  iconBox: {
    width: wp(72), height: wp(72), borderRadius: wp(22),
    borderWidth: 1, borderColor: 'rgba(107,163,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: hp(20),
  },

  badge: {
    flexDirection: 'row', alignItems: 'center', gap: wp(6),
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(107,163,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(107,163,255,0.2)',
    borderRadius: wp(20), paddingHorizontal: wp(12), paddingVertical: hp(5),
    marginBottom: hp(16),
  },
  badgeDot: {
    width: wp(6), height: wp(6), borderRadius: wp(3),
    backgroundColor: C.accent,
    shadowColor: C.accent, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 6,
  },
  badgeTxt: { fontSize: scaleFont(9.5), color: 'rgba(107,163,255,0.9)', fontWeight: '700', letterSpacing: 0.8 },

  headline: {
    fontSize: scaleFont(34), fontWeight: '800', color: C.white,
    lineHeight: scaleFont(40), letterSpacing: -0.5, marginBottom: hp(10),
  },
  headlineAccent: { color: C.accent },
  subline: { fontSize: scaleFont(13), color: C.muted, lineHeight: scaleFont(22) },
  sublineStrong: { color: 'rgba(255,255,255,0.6)', fontWeight: '600' },

  // ── OTP ──
  formSection: {},

  otpRow: { flexDirection: 'row', gap: wp(12), marginBottom: hp(28) },

  otpBox: {
    height: hp(64), borderRadius: wp(14), borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },

  otpDigit: {
    fontSize: scaleFont(24), fontWeight: '800', color: C.white,
  },

  cursor: {
    width: 2, height: hp(28), backgroundColor: C.accent, borderRadius: 1,
  },

  hiddenInput: {
    position: 'absolute', width: '100%', height: hp(64),
    opacity: 0, top: 0, left: 0,
  },

  // ── Button ──
  btn: {
    height: hp(52), borderRadius: wp(12),
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: wp(20),
  },
  btnOff: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  btnTxtOn:  { flex: 1, textAlign: 'center', fontSize: scaleFont(15), fontWeight: '700', color: C.white, letterSpacing: 0.3, marginLeft: wp(28) },
  btnTxtOff: { flex: 1, textAlign: 'center', fontSize: scaleFont(15), fontWeight: '700', color: 'rgba(255,255,255,0.2)', letterSpacing: 0.3, marginLeft: wp(28) },
  btnArrow:    { width: wp(28), height: wp(28), borderRadius: wp(8), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  btnArrowOff: { backgroundColor: 'rgba(255,255,255,0.04)' },

  // ── Resend ──
  resendRow: { alignItems: 'center', marginTop: hp(18) },
  resendTxt: { fontSize: scaleFont(12.5), color: 'rgba(255,255,255,0.25)', fontWeight: '500' },
  resendLink: { color: 'rgba(107,163,255,0.75)', fontWeight: '700' },
  resendDisabled: { color: 'rgba(255,255,255,0.2)' },

  // ── Timer ──
  timerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wp(8), marginTop: hp(14) },
  timerRing: {
    width: wp(32), height: wp(32), borderRadius: wp(16),
    borderWidth: 2, borderColor: 'rgba(107,163,255,0.25)',
    borderTopColor: 'rgba(107,163,255,0.7)',
    alignItems: 'center', justifyContent: 'center',
  },
  timerRingTxt: { fontSize: scaleFont(9), color: 'rgba(107,163,255,0.7)', fontWeight: '800' },
  timerTxt:     { fontSize: scaleFont(11), color: 'rgba(255,255,255,0.2)', fontWeight: '500' },
  timerVal:     { color: 'rgba(107,163,255,0.6)', fontWeight: '700' },
});