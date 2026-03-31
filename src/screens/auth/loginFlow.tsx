import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/NavigationType/type';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { wp, hp, scaleFont } from '../../utils/responcive/responcive';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { validateUsername, validatePassword } from '../../utils/validation/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginFlow: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {
    const usernameCheck = validateUsername(username);
    const passwordCheck = validatePassword(password);

    setUsernameError(usernameCheck.message);
    setPasswordError(passwordCheck.message);

    if (!usernameCheck.isValid || !passwordCheck.isValid) return;

    navigation.navigate('OTPVerification');
  };

  const handlePasswordChange = (text: string) => {
    if (showPassword) {
      setPassword(text);
    } else if (text.length > password.length) {
      setPassword(password + text.slice(password.length));
    } else {
      setPassword(password.slice(0, text.length));
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={Platform.OS === 'ios' ? 30 : 80}
      enableResetScrollToCoords={false}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Login</Text>

      <View style={styles.formGroup}>

        <View style={styles.usernameFrame}>
          <Text style={styles.fieldLabel}>Username</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.inputText}
              value={username}
              onChangeText={(text) => { setUsername(text); setUsernameError(''); }}
              placeholder=""
              placeholderTextColor="#8E8E93"
              autoCapitalize="none"
            />
          </View>
          {usernameError.length > 0 && (
            <Text style={styles.errorText}>{usernameError}</Text>
          )}
        </View>

        <View style={styles.passwordFrame}>
          <Text style={styles.fieldLabel}>Password</Text>
          <View
            style={[
              styles.inputGroup,
              { borderBottomColor: passwordFocused ? '#2288FD' : '#2288FD',
                flexDirection: 'row', alignItems: 'flex-end' },
            ]}
          >
            <TextInput
              style={[styles.inputText, { flex: 1 }]}
              value={showPassword ? password : '*'.repeat(password.length)}
              onChangeText={handlePasswordChange}
              placeholder=""
              placeholderTextColor="#8E8E93"
              secureTextEntry={false}
              autoCorrect={false}
              autoCapitalize="none"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="#757575"
              />
            </TouchableOpacity>
          </View>
          {/* {passwordError.length > 0 && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )} */}
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity activeOpacity={0.7}>
        <Text style={styles.forgotText}>Forgotten password?</Text>
      </TouchableOpacity>

    </KeyboardAwareScrollView>
  );
};

export default LoginFlow;

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: hp(48),
  },

  title: {
    marginTop: hp(115),          
    alignSelf: 'center',
    fontFamily: 'Urbanist-Bold',
    fontWeight: '700',
    fontSize: scaleFont(30),
    lineHeight: scaleFont(30) * 1.30,
    letterSpacing: scaleFont(30) * -0.01,
    color: '#1E232C',
    textAlign: 'center',
  },

  // Figma: top:200  left:16  width:356  height:229
  formGroup: {
    marginTop: hp(40),            // figma:42 × 812/844 = 40.4
    marginLeft: wp(15),           // figma:16 × 375/390 = 15.4
    width: wp(342),               // figma:356 × 375/390 = 342.3
    gap: hp(14),                  // figma:15 × 812/844 = 14.4
  },

  usernameFrame: {
    width: wp(342),               
    height: hp(72),               
    gap: hp(14),                  
  },

  passwordFrame: {
    width: wp(342),               
    height: hp(72),               
    gap: hp(14),                  
  },

  fieldLabel: {
    height: hp(17),               
    fontFamily: 'Urbanist-Medium',
    fontWeight: '500',
    fontSize: scaleFont(14),
    lineHeight: scaleFont(14) * 1.25,
    letterSpacing: 0,
    color: '#8E8E93',
  },

  inputGroup: {
    width: wp(342),               
    height: hp(40),               
    borderBottomWidth: 1,
    borderBottomColor: '#2288FD',
    justifyContent: 'flex-end',
    paddingBottom: hp(18),
  },

  inputText: {
    height: hp(19),               
    fontFamily: 'Urbanist-Medium',
    fontWeight: '500',
    fontSize: scaleFont(16),
    lineHeight: scaleFont(16) * 1.25,
    letterSpacing: 0,
    color: '#000000',
    paddingVertical: 0,
  },

  // wrapper — holds hidden input + display text
  passwordInputWrapper: {
    flex: 1,
    height: hp(19),
    justifyContent: 'flex-end',
  },

  // invisible input — covers full wrapper to capture all touches
  passwordHiddenInput: {
    position: 'absolute',
  },

  // visible display — shows * or real text
  passwordDisplay: {
    height: hp(19),
    fontFamily: 'Urbanist-Medium',
    fontWeight: '500',
    fontSize: scaleFont(16),
    letterSpacing: 0,
    color: '#000000',
    paddingVertical: 0,
  },

  passwordMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: hp(19),
    fontFamily: 'Urbanist-Medium',
    fontWeight: '500',
    fontSize: scaleFont(16),
    letterSpacing: 0,
    color: '#000000',
  },

  eyeButton: {
    paddingLeft: wp(8),
    paddingBottom: hp(2),
  },

  eyeImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#757575',
  },

  // Figma: width:331  height:45  left:12.5  borderRadius:10  bg:#2288FD
  // Figma: width:331  height:45  left:12.5  borderRadius:10  bg:#2288FD
  loginButton: {
    width: wp(318),              // figma:331  × 375/390 = 318.3
    height: hp(43),              // figma:45   × 812/844 = 43.3
    alignSelf: 'center',
    backgroundColor: '#2288FD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Figma: Urbanist SemiBold 600  15px  LH:100%  LS:0%  color:#FFFFFF
  loginButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontWeight: '600',
    fontSize: scaleFont(15),
    letterSpacing: 0,
    textAlign: 'center',
    color: '#FFFFFF',
  },

  // Figma: width:144  height:21  top:444  left:119  Urbanist SemiBold 600  15px  LH:140%  LS:1%  color:#2288FD
  errorText: {
    marginTop: hp(4),
    fontFamily: 'Urbanist-Regular',
    fontSize: scaleFont(12),
    color: '#FF0000',
  },

  forgotText: {
    marginTop: hp(19),
    alignSelf: 'center',
    fontFamily: 'Urbanist-SemiBold',
    fontWeight: '600',
    fontSize: scaleFont(15),
    lineHeight: scaleFont(15) * 1.40,
    letterSpacing: scaleFont(15) * 0.01,
    textAlign: 'center',
    color: '#2288FD',
  },

});
