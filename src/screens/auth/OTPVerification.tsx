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
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/NavigationType/type';
import OtpImage from '../../images/loginImage/otp.svg';
import India from '../../images/loginImage/india.svg';
import Back from '../../images/loginImage/back.svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

type Props = NativeStackScreenProps<RootStackParamList, 'OTPVerification'>;

const OtpVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
    const { username, password ,phone} = route.params;
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
            phone:phone
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
                <Back style={styles.backIcon} />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>OTP Verification</Text>
/Users/harsh/Downloads/back.svg


<OtpImage style={styles.image}/>


            {/* Subtitle */}
            <Text style={styles.subtitle}>
                Enter the verification code you received on
            </Text>

            {/* Phone */}
            <View style={styles.phoneContainer}>
                <India style={styles.flag} />
                <Text style={styles.phoneText}>+91{phone}</Text>
            </View>

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

        // borderRadius: 12, 
        backgroundColor: '#fff', 
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
        gap: 10,
        marginBottom: SCREEN_HEIGHT * 0.02,
    },

    flag: {
        width: 25,
        height: 25,
    },

    phoneText: {
        fontFamily: 'Urbanist-Medium',
        fontSize: scaleFont(16),
        color: '#838BA1',
    },

    otpContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
         justifyContent: 'center', 
        width: SCREEN_WIDTH * 0.9,
        gap: 15,
        marginBottom: SCREEN_HEIGHT * 0.05,
    },

    otpInput: {
        width: 50,
        height: 44,
        marginTop :4,
        borderWidth: 1.5,
        borderColor: '#2288FD',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: scaleFont(16),
        fontFamily: 'Urbanist-Medium',
        color: '#1E232C',
        backgroundColor: '#fff',
    },

    button: {
        width: 357,
        height: 48,
        backgroundColor: '#2288FD',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom :-10
    },

    buttonText: {
        fontFamily: 'Urbanist-Medium',
        fontSize: scaleFont(16),
        color: '#fff',
    },

    resendButton: {
        marginTop: SCREEN_HEIGHT * 0.032,
    },
    resendText: {
        fontFamily: 'Urbanist-Medium',
        fontSize: scaleFont(15),
        color: '#1E232C',
        textAlign: 'center',
    },

    resendLink: {
        color: '#2288FD',
    },
});
