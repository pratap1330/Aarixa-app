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
