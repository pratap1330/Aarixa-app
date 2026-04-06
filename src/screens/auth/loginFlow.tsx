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

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/NavigationType/type';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { wp, hp, scaleFont } from '../../utils/responcive/responcive';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { validateUsername, validatePassword } from '../../utils/validation/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginFlow: React.FC<Props> = ({ navigation }) => {
  // const phoneNo = 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // ✅ Check if form is valid (for button disable)
  const isFormValid = useMemo(() => {
    return username.length > 0 && password.length > 0 && !usernameError && !passwordError;
  }, [username, password, usernameError, passwordError]);

  const handleLogin = () => {
    const usernameCheck = validateUsername(username);
    const passwordCheck = validatePassword(password);

    setUsernameError(usernameCheck.isValid ? '' : usernameCheck.message);
    setPasswordError(passwordCheck.isValid ? '' : passwordCheck.message);

    if (!usernameCheck.isValid || !passwordCheck.isValid) return;

    navigation.navigate('OTPVerification', {
      username,
      password,
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
      <Text style={styles.title}>Login</Text>

      <View style={styles.formGroup}>

        {/* ================= USERNAME ================= */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Username</Text>

          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError('');
            }}
            onBlur={() => {
              const res = validateUsername(username);
              setUsernameError(res.isValid ? '' : res.message);
            }}
            autoCapitalize="none"
          />

          {usernameError ? (
            <Text style={styles.errorText}>{usernameError}</Text>
          ) : null}
        </View>

        {/* ================= PASSWORD ================= */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.inputFlex}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              onBlur={() => {
                const res = validatePassword(password);
                setPasswordError(res.isValid ? '' : res.message);
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
{/* 
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#757575"
              />
            </TouchableOpacity> */}

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={require('../../images/loginImage/eye.png')}
                style={{
                  width: wp(22),
                  height: wp(22),
                  tintColor: '#757575',
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>

          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>

        {/* ================= BUTTON ================= */}
        <TouchableOpacity
          style={[
            styles.loginButton,
            { opacity: isFormValid ? 1 : 0.5 },
          ]}
          disabled={!isFormValid}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgotten password?</Text>
      </TouchableOpacity>

    </KeyboardAwareScrollView>
  );
};

export default LoginFlow;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    paddingBottom: hp(40),
  },

  title: {
    marginTop: hp(100),
    textAlign: 'center',
    fontSize: scaleFont(28),
    fontWeight: '700',
    color: '#1E232C',
  },

  formGroup: {
    marginTop: hp(40),
    paddingHorizontal: wp(20),
    gap: hp(20),
  },

  fieldContainer: {
    width: '100%',
  },

  label: {
    fontSize: scaleFont(14),
    color: '#8E8E93',
    marginBottom: hp(6),
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#2288FD',
    minHeight: hp(40),
    paddingVertical: hp(8),
    paddingHorizontal: 0,
    fontSize: scaleFont(16),
    color: '#000',
    textAlignVertical: 'center',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },

  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2288FD',
    minHeight: hp(40),
    paddingVertical: hp(3),
  },

  inputFlex: {
    flex: 1,
    fontSize: scaleFont(16),
    color: '#000',
    paddingVertical: 0,
    textAlignVertical: 'center',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },

  errorText: {
    marginTop: hp(4),
    fontSize: scaleFont(12),
    color: 'red',
  },

  loginButton: {
    marginTop: hp(10),
    minHeight: hp(45),
    paddingVertical: hp(10),
    backgroundColor: '#2288FD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButtonText: {
    color: '#FFF',
    fontSize: scaleFont(16),
    fontWeight: '600',
  },

  forgotText: {
    marginTop: hp(20),
    textAlign: 'center',
    color: '#2288FD',
    fontSize: scaleFont(14),
  },
});