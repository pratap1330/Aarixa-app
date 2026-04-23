import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/NavigationType/type';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { wp, hp, scaleFont } from '../../utils/responcive/responcive';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { validateUsername, validatePassword } from '../../utils/validation/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginFlow: React.FC<Props> = ({ navigation, route }) => {
  // const { phone } = route.params;
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

  const handleLogin = () => {
    const usernameCheck = validateUsername(username);
    const passwordCheck = validatePassword(password);

    setUsernameError(usernameCheck.isValid ? '' : usernameCheck.message);
    setPasswordError(passwordCheck.isValid ? '' : passwordCheck.message);

    if (!usernameCheck.isValid || !passwordCheck.isValid) return;

    navigation.navigate('CreatePin', {
      username,
      password,
      // phone,
    });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={Platform.OS === 'ios' ? 30 : 80}
      showsVerticalScrollIndicator={false}
    >
      {/* ===== APP LOGO ===== */}
      {/* <Image
        source={require("../../images/splash/splash.png")}
        style={styles.logo}
      /> */}

      {/* ===== TITLE ===== */}
      {/* <Text style={styles.title}>Login</Text> */}

      <View style={styles.formGroup}>

        {/* ===== USERNAME ===== */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Username</Text>
          <View style={[styles.inputBox, usernameFocused ? styles.inputBoxFocused : styles.inputBoxDefault]}>
            <Ionicons
              name="person-outline"
              size={scaleFont(18)}
              color="#007AFF"
            />
            <TextInput
              style={styles.inputFlex}
              value={username}
              placeholder="Yourname"
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

        {/* ===== PASSWORD ===== */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.inputBox, passwordFocused ? styles.inputBoxFocused : styles.inputBoxDefault]}>
            <Ionicons
              name="lock-closed-outline"
              size={scaleFont(18)}
              color="#9CA3AF"
            />
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
                style={{
                  width: wp(22),
                  height: wp(22),
                  tintColor: '#6B7280',
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        {/* ===== LOGIN BUTTON ===== */}
        <TouchableOpacity
          style={[styles.loginButton, { opacity: isFormValid ? 1 : 0.5 }]}
          disabled={!isFormValid}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

      </View>

      {/* ===== FORGOT PASSWORD ===== */}
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>

    </KeyboardAwareScrollView>
  );
};

export default LoginFlow;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: hp(40),
  },

  // "App LOGO" — Urbanist ExtraBold 32px, #2288FD, top 80px
  logo: {
    marginTop: hp(40),
    width: wp(160),
    height: hp(120),
    alignSelf: "center",
    resizeMode: "contain",
    tintColor: "#2288FD",
  },

  // "Login" — Urbanist Bold 30px, #1E232C, top ~160px (5px after logo)
  title: {
    marginTop: hp(5),
    textAlign: 'center',
    fontSize: scaleFont(30),
    fontWeight: '700',
    color: '#1E232C',
    lineHeight: scaleFont(39),
    letterSpacing: -0.3,
  },

  // Form group: top 223px, left/right 17px → paddingHorizontal wp(17)
  formGroup: {
    marginTop: hp(175),
    paddingHorizontal: wp(17),
    gap: hp(16),
  },

  fieldContainer: {
    width: '100%',
  },

  // Label — Urbanist Regular 14px, #000000
  label: {
    fontSize: scaleFont(14),
    fontWeight: '400',
    color: '#000000',
    marginBottom: hp(8),
  },

  // Input box — height 44px, border-radius 10px, padding 10 12, gap 8
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(44),
    borderRadius: wp(10),
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(12),
    gap: wp(8),
  },

  // Default border (unfocused) — #D1D5DB
  inputBoxDefault: {
    borderColor: '#D1D5DB',
  },

  // Focused border — #007AFF
  inputBoxFocused: {
    borderColor: '#007AFF',
  },

  inputFlex: {
    flex: 1,
    fontSize: scaleFont(16),
    color: '#000000',
    paddingVertical: 0,
    ...Platform.select({ android: { includeFontPadding: false } }),
  },

  errorText: {
    marginTop: hp(4),
    fontSize: scaleFont(12),
    color: 'red',
  },

  // Login button — height 45px, border-radius 10px, #2288FD
  loginButton: {
    marginTop: hp(10),
    height: hp(45),
    backgroundColor: '#2288FD',
    borderRadius: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Button text — Urbanist SemiBold 15px, #FFFFFF
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: scaleFont(15),
    fontWeight: '600',
  },

  // Forgot text — Urbanist SemiBold 15px, #2288FD
  forgotText: {
    marginTop: hp(24),
    textAlign: 'center',
    color: '#2288FD',
    fontSize: scaleFont(15),
    fontWeight: '600',
    letterSpacing: 0.15,
  },
});
