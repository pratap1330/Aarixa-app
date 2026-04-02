// import React, { useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   Image
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../utils/NavigationType/type';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { wp, hp, scaleFont } from '../../utils/responcive/responcive';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { validateUsername, validatePassword } from '../../utils/validation/validation';

// type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// const LoginFlow: React.FC<Props> = ({ navigation }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const [usernameError, setUsernameError] = useState('');
//   const [passwordError, setPasswordError] = useState('');

//   // ✅ Check if form is valid (for button disable)
//   const isFormValid = useMemo(() => {
//     return username.length > 0 && password.length > 0 && !usernameError && !passwordError;
//   }, [username, password, usernameError, passwordError]);

//   const handleLogin = () => {
//     const usernameCheck = validateUsername(username);
//     const passwordCheck = validatePassword(password);

//     setUsernameError(usernameCheck.isValid ? '' : usernameCheck.message);
//     setPasswordError(passwordCheck.isValid ? '' : passwordCheck.message);

//     if (!usernameCheck.isValid || !passwordCheck.isValid) return;

//     navigation.navigate('OTPVerification', {
//       username,
//       password,
//     });
//   };

//   return (
//     <KeyboardAwareScrollView
//       contentContainerStyle={styles.container}
//       enableOnAndroid={true}
//       keyboardShouldPersistTaps="handled"
//       extraScrollHeight={Platform.OS === 'ios' ? 30 : 80}
//       showsVerticalScrollIndicator={false}
//     >
//       <Text style={styles.title}>Login</Text>

//       <View style={styles.formGroup}>

//         {/* ================= USERNAME ================= */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Username</Text>

//           <TextInput
//             style={styles.input}
//             value={username}
//             onChangeText={(text) => {
//               setUsername(text);
//               setUsernameError('');
//             }}
//             onBlur={() => {
//               const res = validateUsername(username);
//               setUsernameError(res.isValid ? '' : res.message);
//             }}
//             autoCapitalize="none"
//           />

//           {usernameError ? (
//             <Text style={styles.errorText}>{usernameError}</Text>
//           ) : null}
//         </View>

//         {/* ================= PASSWORD ================= */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Password</Text>

//           <View style={styles.passwordWrapper}>
//             <TextInput
//               style={styles.inputFlex}
//               value={password}
//               onChangeText={(text) => {
//                 setPassword(text);
//                 setPasswordError('');
//               }}
//               onBlur={() => {
//                 const res = validatePassword(password);
//                 setPasswordError(res.isValid ? '' : res.message);
//               }}
//               secureTextEntry={!showPassword}
//               autoCapitalize="none"
//             />
// {/* 
//             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//               <Ionicons
//                 name={showPassword ? 'eye-outline' : 'eye-off-outline'}
//                 size={22}
//                 color="#757575"
//               />
//             </TouchableOpacity> */}

//             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//   <Image
//     source={require('../../images/loginImage/eye.png')}
//     style={{
//       width: 22,
//       height: 22,
//       tintColor: '#757575', // optional (remove if your image already has color)
//       resizeMode: 'contain',
//     }}
//   />
// </TouchableOpacity>
//           </View>

//           {passwordError ? (
//             <Text style={styles.errorText}>{passwordError}</Text>
//           ) : null}
//         </View>

//         {/* ================= BUTTON ================= */}
//         <TouchableOpacity
//           style={[
//             styles.loginButton,
//             { opacity: isFormValid ? 1 : 0.5 },
//           ]}
//           disabled={!isFormValid}
//           onPress={handleLogin}
//         >
//           <Text style={styles.loginButtonText}>Login</Text>
//         </TouchableOpacity>

//       </View>

//       <TouchableOpacity>
//         <Text style={styles.forgotText}>Forgotten password?</Text>
//       </TouchableOpacity>

//     </KeyboardAwareScrollView>
//   );
// };

// export default LoginFlow;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#FFF',
//     paddingBottom: hp(40),
//   },

//   title: {
//     marginTop: hp(100),
//     textAlign: 'center',
//     fontSize: scaleFont(28),
//     fontWeight: '700',
//     color: '#1E232C',
//   },

//   formGroup: {
//     marginTop: hp(40),
//     paddingHorizontal: wp(20),
//     gap: hp(20),
//   },

//   fieldContainer: {
//     width: '100%',
//   },

//   label: {
//     fontSize: scaleFont(14),
//     color: '#8E8E93',
//     marginBottom: hp(6),
//   },

//   input: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#2288FD',
//     height: hp(40),
//     fontSize: scaleFont(16),
//     color: '#000',
//   },

//   passwordWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#2288FD',
//     height: hp(40),
//   },

//   inputFlex: {
//     flex: 1,
//     fontSize: scaleFont(16),
//     color: '#000',
//   },

//   errorText: {
//     marginTop: hp(4),
//     fontSize: scaleFont(12),
//     color: 'red',
//   },

//   loginButton: {
//     marginTop: hp(10),
//     height: hp(45),
//     backgroundColor: '#2288FD',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   loginButtonText: {
//     color: '#FFF',
//     fontSize: scaleFont(16),
//     fontWeight: '600',
//   },

//   forgotText: {
//     marginTop: hp(20),
//     textAlign: 'center',
//     color: '#2288FD',
//     fontSize: scaleFont(14),
//   },
// });

import React, { useState, useMemo, useRef, useEffect } from 'react';
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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/NavigationType/type';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { wp, hp, scaleFont } from '../../utils/responcive/responcive';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { validateUsername, validatePassword } from '../../utils/validation/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  blue0:      '#1847CC',
  blue1:      '#1238A8',
  blue2:      '#0A1F6E',
  dark0:      '#060D2E',
  dark1:      '#04091E',
  darkest:    '#020510',
  accent:     '#6BA3FF',
  accentDim:  'rgba(107,163,255,0.5)',
  green:      '#4ADE80',
  red:        'rgba(255,80,80,0.8)',
  white:      '#FFFFFF',
  muted:      'rgba(255,255,255,0.35)',
  hint:       'rgba(255,255,255,0.18)',
  fieldBg:    'rgba(255,255,255,0.04)',
  fieldBdr:   'rgba(255,255,255,0.08)',
  fieldFoc:   'rgba(107,163,255,0.06)',
  fieldFocBdr:'rgba(107,163,255,0.45)',
};

// ─── Simple Label Input (no floating — clean & fast to read) ─────────────────
interface InputProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  onBlur: () => void;
  placeholder: string;
  secureTextEntry?: boolean;
  rightElement?: React.ReactNode;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const LabelInput: React.FC<InputProps> = ({
  label, value, onChangeText, onBlur, placeholder,
  secureTextEntry, rightElement, error, autoCapitalize = 'none',
}) => {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: focused ? 1 : 0,
      duration: 200, useNativeDriver: false,
    }).start();
  }, [focused]);

  const borderColor = error
    ? 'rgba(255,80,80,0.4)'
    : focused
    ? C.fieldFocBdr
    : C.fieldBdr;

  const bgColor = error
    ? 'rgba(255,50,50,0.04)'
    : focused ? C.fieldFoc : C.fieldBg;

  return (
    <View style={inp.wrap}>
      <Text style={inp.label}>{label}</Text>
      <View style={[inp.box, { borderColor, backgroundColor: bgColor }]}>
        <TextInput
          style={inp.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur(); }}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.18)"
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
        />
        {rightElement && <View style={inp.right}>{rightElement}</View>}
      </View>
      {!!error && (
        <Text style={inp.err}>{error}</Text>
      )}
    </View>
  );
};

const inp = StyleSheet.create({
  wrap:  { marginBottom: hp(16) },
  label: {
    fontSize: scaleFont(10), color: 'rgba(255,255,255,0.35)',
    letterSpacing: 2, textTransform: 'uppercase', fontWeight: '600',
    marginBottom: hp(8), paddingLeft: wp(2),
  },
  box: {
    height: hp(52), borderRadius: wp(12), borderWidth: 1,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: wp(16),
  },
  input: {
    flex: 1, fontSize: scaleFont(15), color: C.white,
    fontWeight: '400', letterSpacing: 0.2,
  },
  right: { marginLeft: wp(8) },
  err: {
    fontSize: scaleFont(10.5), color: C.red,
    marginTop: hp(5), paddingLeft: wp(2), fontWeight: '500',
  },
});

// ─── Ambient light blob ───────────────────────────────────────────────────────
const Blob: React.FC<{ style: object; color: string; size: number }> = ({ style, color, size }) => {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 5000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 5000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
  }, []);
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.28] });
  return (
    <Animated.View style={[{
      position: 'absolute', width: size, height: size,
      borderRadius: size / 2, backgroundColor: color, opacity,
    }, style]} pointerEvents="none" />
  );
};

// ─── Tick mark ───────────────────────────────────────────────────────────────
const Tick: React.FC = () => (
  <View style={{
    width: wp(20), height: wp(20), borderRadius: wp(10),
    backgroundColor: 'rgba(74,222,128,0.1)',
    borderWidth: 1, borderColor: 'rgba(74,222,128,0.25)',
    alignItems: 'center', justifyContent: 'center',
  }}>
    <Ionicons name="checkmark" size={scaleFont(11)} color={C.green} />
  </View>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const LoginFlow: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [userErr,   setUserErr]   = useState('');
  const [passErr,   setPassErr]   = useState('');

  // Staggered entrance
  const topOp  = useRef(new Animated.Value(0)).current;
  const topY   = useRef(new Animated.Value(hp(-20))).current;
  const formOp = useRef(new Animated.Value(0)).current;
  const formY  = useRef(new Animated.Value(hp(30))).current;
  const btnSc  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(160, [
      Animated.parallel([
        Animated.timing(topOp, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(topY,  { toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(formOp, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(formY,  { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const isValid = useMemo(
    () => username.trim().length >= 3 && password.length >= 8 && !userErr && !passErr,
    [username, password, userErr, passErr]
  );

  const handleLogin = () => {
    const u = validateUsername(username);
    const p = validatePassword(password);
    setUserErr(u.isValid ? '' : u.message);
    setPassErr(p.isValid ? '' : p.message);
    if (!u.isValid || !p.isValid) return;
    navigation.navigate('OTPVerification', { username, password });
  };

  const onPressIn  = () => Animated.spring(btnSc, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(btnSc, { toValue: 1, friction: 4, useNativeDriver: true }).start();

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
        <Blob size={wp(280)} color="#4090FF" style={{ top: hp(80), right: wp(-100) }} />
        <Blob size={wp(220)} color="#2050CC" style={{ bottom: hp(100), left: wp(-60) }} />

        {/* SEBI badge top right */}
        <View style={s.sebiBadge}>
          <View style={s.sebiDot} />
          <Text style={s.sebiTxt}>SEBI</Text>
        </View>

        <KeyboardAwareScrollView
          contentContainerStyle={s.scroll}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={Platform.OS === 'ios' ? 20 : 60}
          showsVerticalScrollIndicator={false}
        >
          {/* ── TOP: Logo + Editorial headline ── */}
          <Animated.View style={[s.topSection, { opacity: topOp, transform: [{ translateY: topY }] }]}>

            {/* Logo row */}
            <View style={s.logoRow}>
              <View style={s.logoIconBox}>
                <Ionicons name="trending-up" size={scaleFont(20)} color={C.white} />
              </View>
              <View>
                <Text style={s.logoName}>WealthSpaze</Text>
                <Text style={s.logoSub}>Invest · Grow · Prosper</Text>
              </View>
            </View>

            {/* Big editorial headline */}
            <Text style={s.headline}>
              Your wealth,{'\n'}
              <Text style={s.headlineAccent}>your future.</Text>
            </Text>
            <Text style={s.subhead}>
              Sign in and take control of{'\n'}your financial journey today.
            </Text>

            {/* Stats row — horizontal, clean */}
            <View style={s.statsRow}>
              {[
                { val: '50K+',   lbl: 'Investors' },
                { val: '4.9★',   lbl: 'Rating' },
                { val: '₹500Cr', lbl: 'AUM' },
              ].map((item, i, arr) => (
                <React.Fragment key={i}>
                  <View style={s.statItem}>
                    <Text style={s.statVal}>{item.val}</Text>
                    <Text style={s.statLbl}>{item.lbl}</Text>
                  </View>
                  {i < arr.length - 1 && <View style={s.statSep} />}
                </React.Fragment>
              ))}
            </View>
          </Animated.View>

          {/* ── FORM ── */}
          <Animated.View style={[s.formSection, { opacity: formOp, transform: [{ translateY: formY }] }]}>

            <LabelInput
              label="Username"
              value={username}
              placeholder="Enter your username"
              onChangeText={t => { setUsername(t); setUserErr(''); }}
              onBlur={() => {
                const r = validateUsername(username);
                setUserErr(r.isValid ? '' : r.message);
              }}
              error={userErr}
              rightElement={username.trim().length >= 3 && !userErr ? <Tick /> : undefined}
            />

            <LabelInput
              label="Password"
              value={password}
              placeholder="Enter your password"
              secureTextEntry={!showPass}
              onChangeText={t => { setPassword(t); setPassErr(''); }}
              onBlur={() => {
                const r = validatePassword(password);
                setPassErr(r.isValid ? '' : r.message);
              }}
              error={passErr}
              rightElement={
                <TouchableOpacity onPress={() => setShowPass(v => !v)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                  <Ionicons
                    name={showPass ? 'eye-outline' : 'eye-off-outline'}
                    size={scaleFont(17)}
                    color={showPass ? C.accent : 'rgba(255,255,255,0.2)'}
                  />
                </TouchableOpacity>
              }
            />

            <TouchableOpacity style={s.forgotRow}>
              <Text style={s.forgotTxt}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* CTA Button */}
            <Animated.View style={{ transform: [{ scale: btnSc }] }}>
              <TouchableOpacity
                activeOpacity={0.9}
                disabled={!isValid}
                onPress={handleLogin}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
              >
                {isValid ? (
                  <LinearGradient
                    colors={[C.blue1, C.blue0, '#2563EB']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={s.btn}
                  >
                    <Text style={s.btnTxtOn}>Sign In</Text>
                    <View style={s.btnIcon}>
                      <Ionicons name="arrow-forward" size={scaleFont(15)} color={C.blue0} />
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={[s.btn, s.btnOff]}>
                    <Text style={s.btnTxtOff}>Sign In</Text>
                    <View style={[s.btnIcon, s.btnIconOff]}>
                      <Ionicons name="arrow-forward" size={scaleFont(15)} color="rgba(255,255,255,0.15)" />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Trust strip */}
            <View style={s.trustRow}>
              {[
                { dot: C.green,                  txt: '256-bit SSL' },
                { dot: C.accent,                  txt: 'Bank-grade Security' },
                { dot: 'rgba(218,165,32,0.6)',    txt: 'NSE · BSE' },
              ].map((item, i, arr) => (
                <React.Fragment key={i}>
                  <View style={s.trustItem}>
                    <View style={[s.trustDot, { backgroundColor: item.dot }]} />
                    <Text style={s.trustTxt}>{item.txt}</Text>
                  </View>
                  {i < arr.length - 1 && <View style={s.trustSep} />}
                </React.Fragment>
              ))}
            </View>

            <Text style={s.footer}>
              By continuing, you agree to our{' '}
              <Text style={s.footerLink}>Terms</Text>
              {' & '}
              <Text style={s.footerLink}>Privacy Policy</Text>
            </Text>
          </Animated.View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </>
  );
};

export default LoginFlow;

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: wp(28), paddingBottom: hp(40) },

  sebiBadge: {
    position: 'absolute', top: Platform.OS === 'ios' ? hp(58) : hp(44),
    right: wp(28), zIndex: 10,
    flexDirection: 'row', alignItems: 'center', gap: wp(5),
    backgroundColor: 'rgba(74,222,128,0.07)',
    borderWidth: 1, borderColor: 'rgba(74,222,128,0.18)',
    paddingHorizontal: wp(10), paddingVertical: hp(4), borderRadius: wp(20),
  },
  sebiDot: {
    width: wp(5), height: wp(5), borderRadius: wp(2.5),
    backgroundColor: C.green,
    shadowColor: C.green, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 6,
  },
  sebiTxt: { fontSize: scaleFont(9), color: 'rgba(74,222,128,0.8)', fontWeight: '700', letterSpacing: 0.5 },

  // ── Top section ──
  topSection: {
    paddingTop: Platform.OS === 'ios' ? hp(72) : hp(56),
    paddingBottom: hp(32),
  },

  logoRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: wp(12), marginBottom: hp(28),
  },
  logoIconBox: {
    width: wp(42), height: wp(42), borderRadius: wp(13),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoName: { fontSize: scaleFont(18), fontWeight: '800', color: C.white, letterSpacing: 0.3 },
  logoSub:  { fontSize: scaleFont(9), color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginTop: hp(2), textTransform: 'uppercase' },

  headline: {
    fontSize: scaleFont(36), fontWeight: '800', color: C.white,
    lineHeight: scaleFont(42), letterSpacing: -0.5, marginBottom: hp(10),
  },
  headlineAccent: {
    color: C.accent,
  },
  subhead: {
    fontSize: scaleFont(13), color: C.muted, fontWeight: '400',
    lineHeight: scaleFont(20), marginBottom: hp(22),
  },

  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: hp(18),
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
  },
  statItem: { flex: 1, alignItems: 'center', gap: hp(3) },
  statVal:  { fontSize: scaleFont(16), fontWeight: '800', color: C.white },
  statLbl:  { fontSize: scaleFont(9), color: 'rgba(255,255,255,0.3)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: '600' },
  statSep:  { width: 1, height: hp(30), backgroundColor: 'rgba(255,255,255,0.07)' },

  // ── Form ──
  formSection: { paddingBottom: hp(8) },

  forgotRow: { alignSelf: 'flex-end', marginTop: hp(-6), marginBottom: hp(22) },
  forgotTxt: { fontSize: scaleFont(12.5), color: 'rgba(107,163,255,0.7)', fontWeight: '600' },

  btn: {
    height: hp(52), borderRadius: wp(12),
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: wp(20),
  },
  btnOff: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  btnTxtOn:  { flex: 1, textAlign: 'center', fontSize: scaleFont(15), fontWeight: '700', color: C.white, letterSpacing: 0.4, marginLeft: wp(26) },
  btnTxtOff: { flex: 1, textAlign: 'center', fontSize: scaleFont(15), fontWeight: '700', color: 'rgba(255,255,255,0.2)', letterSpacing: 0.4, marginLeft: wp(26) },
  btnIcon:    { width: wp(26), height: wp(26), borderRadius: wp(8), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  btnIconOff: { backgroundColor: 'rgba(255,255,255,0.04)' },

  trustRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: hp(18), gap: wp(8) },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
  trustDot:  { width: wp(4), height: wp(4), borderRadius: wp(2) },
  trustTxt:  { fontSize: scaleFont(9.5), color: 'rgba(255,255,255,0.2)', fontWeight: '600' },
  trustSep:  { width: 1, height: hp(10), backgroundColor: 'rgba(255,255,255,0.07)' },

  footer: { textAlign: 'center', marginTop: hp(14), fontSize: scaleFont(10.5), color: 'rgba(255,255,255,0.15)', lineHeight: scaleFont(19) },
  footerLink: { color: 'rgba(107,163,255,0.6)', fontWeight: '700' },
});