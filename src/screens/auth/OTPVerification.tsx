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
import { RootStackParamList } from '../../utils/NavigationType/type';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

type Props = NativeStackScreenProps<RootStackParamList, 'OTPVerification'>;

const OtpVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
    const { username, password } = route.params;
    const [otp, setOtp] = useState(Array(4).fill(''));
    const inputRefs = useRef<TextInput[]>([]);
    const isOtpComplete = otp.every(digit => digit !== '');
    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];

        // Only allow 0-9
        if (text && !/^\d$/.test(text)) return;

        // Replace current digit
        newOtp[index] = text;
        setOtp(newOtp);

        if (text) {
            // Always move forward if a digit is entered
            if (index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        } else {
            // Move back if input is cleared
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    // const verfiyotp = () => {
    //     navigation.navigate('CreatePin');

    // }

    const verfiyotp = () => {
        const finalOtp = otp.join('');

        navigation.navigate('CreatePin', {
            username,
            password,
            otp: finalOtp,
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            {/* 🔙 Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Image
                    source={require('../../images/loginImage/back.png')}
                    style={styles.backIcon}
                    resizeMode="contain"
                />
            </TouchableOpacity>

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
                Enter the verification code you received 
            </Text>

            {/* Phone */}
            {/* <View style={styles.phoneContainer}>
                <Image
                    source={require('../../images/loginImage/india.png')}
                    style={styles.flag}
                    resizeMode="contain"
                />
                <Text style={styles.phoneText}>+91 98765 43210</Text>
            </View> */}

            {/* OTP Inputs */}
            <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => {
                            if (ref) inputRefs.current[index] = ref;
                        }}
                        style={styles.otpInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={value}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
                                inputRefs.current[index - 1]?.focus();
                            }
                        }}
                        autoFocus={index === 0}  // only first box auto-focused
                    />
                ))}
            </View>

            {/* Verify Button */}
            {/* <TouchableOpacity style={styles.button}
                onPress={verfiyotp}>
                <Text
                    style={styles.buttonText}>Verify</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
                style={[
                    styles.button,
                    { opacity: isOtpComplete ? 1 : 0.5 }
                ]}
                disabled={!isOtpComplete}
                onPress={verfiyotp}
            >
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            {/* Resend */}
            <TouchableOpacity style={styles.resendButton}>
                <Text style={styles.resendText}>
                    Didn’t receive code?{' '}
                    <Text style={styles.resendLink}>Resend</Text>
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

    /* 🔙 Back Button Style */
    backButton: {
        position: 'absolute',
        top: 59,
        left: 16,
        width: 41,
        height: 41,

        justifyContent: 'center',
        alignItems: 'center',

        // borderWidth: 1,
        borderColor: '#E8ECF4',
        borderStyle: 'solid',

        // borderRadius: 12, // 👈 optional (Figma me rounded hai to rakhna)
        backgroundColor: '#fff', // 👈 clean look
    },

    backIcon: {
        width: 38,   // 42px ~ 11% of 375px width
        height: 38,
        borderRadius: 12,
        // keep it square
        resizeMode: 'contain',
    },
    // backIcon: {
    //     width: SCREEN_WIDTH * 0.11,   // 42px ~ 11% of 375px width
    //     height: SCREEN_WIDTH * 0.11,  // keep it square
    //     // resizeMode: 'contain',
    // },
    title: {
        width: SCREEN_WIDTH * 0.7,
        fontFamily: 'Urbanist-SemiBold',
        // fontWeight: '700',
        fontSize: scaleFont(30),
        lineHeight: scaleFont(38),
        letterSpacing: -1,
        color: '#1E232C',
        textAlign: 'center',
        marginBottom: SCREEN_HEIGHT * 0.02,
    },

    image: {
        width: SCREEN_WIDTH * 0.25,
        height: SCREEN_WIDTH * 0.28,
        marginBottom: SCREEN_HEIGHT * 0.04,
    },

    subtitle: {
        // width: SCREEN_WIDTH * (304 / 375),
        fontFamily: 'Urbanist-Medium',
        // fontWeight: '500',
        fontSize: scaleFont(16),
        lineHeight: scaleFont(24),
        color: '#838BA1',
        textAlign: 'center',
        // marginBottom: SCREEN_HEIGHT * 0.00005,
    },

    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SCREEN_WIDTH * 0.02,
        marginBottom: SCREEN_HEIGHT * 0.015,
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
        fontFamily: 'Urbanist-Medium',
        width: SCREEN_WIDTH * 0.9,
        marginBottom: SCREEN_HEIGHT * 0.05,
    },

    otpInput: {
        width: SCREEN_WIDTH * 0.18,
        height: SCREEN_WIDTH * 0.12,
        borderColor: '#2288FD',
        fontFamily: 'Urbanist-SemiBold',
        borderBottomWidth: 2,
        textAlign: 'center',
        fontSize: scaleFont(16),
        color: '#1E232C',
    },

    button: {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.065,
        backgroundColor: '#2288FD',
        borderRadius: SCREEN_WIDTH * 0.03,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        fontFamily: 'Urbanist-Medium',
        // fontWeight: '700',
        fontSize: scaleFont(16),
        color: '#FFFFFF',
    },

    resendButton: {
        marginTop: SCREEN_HEIGHT * 0.015,
    },

    resendText: {
        fontFamily: 'Urbanist-Medium',
        // fontWeight: '600',
        fontSize: scaleFont(15),
        color: '#1E232C',
        textAlign: 'center',
    },

    resendLink: {
        color: '#2288FD',
    },
});