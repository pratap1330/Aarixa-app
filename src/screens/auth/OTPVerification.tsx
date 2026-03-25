import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OtpVerification } from '../../utils/NavigationType/type';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

type Props = NativeStackScreenProps<OtpVerification, 'OTPVerification'>;

const OtpVerificationScreen: React.FC<Props> = ({ navigation }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));

  const inputRefs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Backspace → previous
    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Title */}
      <Text style={styles.title}>OTP Verification</Text>

      {/* Image */}
      <Image
        source={require('../../images/loginImage/otp.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Enter the verification code you received on
      </Text>

      {/* Phone */}
      <View style={styles.phoneContainer}>
        <Image
          source={require('../../images/loginImage/india.png')}
          style={styles.flag}
          resizeMode="contain"
        />
        <Text style={styles.phoneText}>+91 98765 43210</Text>
      </View>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            // ref={(ref) => (inputRefs.current[index] = ref!)}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      {/* Resend */}
      <TouchableOpacity style={styles.resendButton}>
        <Text style={styles.resendText}>
          Didn’t receive code? Resend
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: SCREEN_HEIGHT * 0.1,
  },

  title: {
    width: SCREEN_WIDTH * 0.7,
    fontFamily: 'Urbanist-Medium',
    fontWeight: '700',
    fontSize: scaleFont(30),
    lineHeight: scaleFont(38),
    letterSpacing: -1,
    color: '#1E232C',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02, // 🔥 reduced gap
  },

  image: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_WIDTH * 0.28,
    marginBottom: SCREEN_HEIGHT * 0.015, // 🔥 reduced
  },

  subtitle: {
    width: SCREEN_WIDTH * (304 / 375),
    fontFamily: 'Urbanist-Medium',
    fontWeight: '500',
    fontSize: scaleFont(16),
    lineHeight: scaleFont(24),
    color: '#838BA1',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.01, // 🔥 add tight spacing
  },

  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SCREEN_WIDTH * 0.02,
    marginBottom: SCREEN_HEIGHT * 0.02, // 🔥 reduced
  },

  flag: {
    width: SCREEN_WIDTH * (25 / 375),
    height: SCREEN_WIDTH * (25 / 375),
  },

  phoneText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: scaleFont(16),
    color: '#838BA1',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.9,
    marginBottom: SCREEN_HEIGHT * 0.05,
  },

  otpInput: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderWidth: 1,
    borderColor: '#2288FD',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: scaleFont(18),
    color: '#1E232C',
  },

  button: {
    width: SCREEN_WIDTH * 0.92,
    height: SCREEN_HEIGHT * 0.065,
    backgroundColor: '#2288FD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.03,
  },

  buttonText: {
    fontFamily: 'Urbanist-Medium',
    fontWeight: '700',
    fontSize: scaleFont(16),
    color: '#FFFFFF',
  },

  resendButton: {
    marginTop: SCREEN_HEIGHT * 0.015,
  },

  resendText: {
    fontFamily: 'Urbanist-Medium',
    fontWeight: '600',
    fontSize: scaleFont(14),
    lineHeight: scaleFont(20),
    letterSpacing: 0.5,
    color: '#2288FD',
    textAlign: 'center',
  },
});