import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/NavigationType/type';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    navigation.navigate('OTPVerification');
  };

  return (
    <View style={styles.container}>
      
      {/* LOGIN TITLE */}
      <Text style={styles.title}>Login</Text>


      {/* SUBTEXT */}
      <Text style={styles.subtitle}>
        Enter your phone number to receive a{"\n"}6-digit code to verify
      </Text>

      {/* INPUT BOX */}
      <View style={styles.inputWrapper}>
        <Text style={styles.countryCode}>+91</Text>

        <TextInput
          placeholder="Enter phone number"
          placeholderTextColor="#838BA1"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          maxLength={10}
        />
      </View>

      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Send Code</Text>
      </TouchableOpacity>

    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16, // Figma left:16
  },

  title: {
    position: 'absolute',
    top: 119,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'Urbanist',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 39,
    letterSpacing: -0.3,
    color: '#1E232C',
  },

  subtitle: {
    position: 'absolute',
    top: 170,
    left: 16,
    right: 16,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: '#838BA1',
  },

  inputWrapper: {
    position: 'absolute',
    top: 260,
    left: 16,
    width: 356,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8ECF4',
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  countryCode: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  button: {
    position: 'absolute',
    top: 340,
    left: 16,
    width: 356,
    height: 50,
    backgroundColor: '#2288FD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});