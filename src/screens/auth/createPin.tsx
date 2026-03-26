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

const wp = (size: number) => (SCREEN_WIDTH / 375) * size;
const hp = (size: number) => (SCREEN_HEIGHT / 812) * size;
const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePin'>;

const CreatePinScreen: React.FC<Props> = ({ navigation }) => {

    const [pin, setPin] = useState(Array(4).fill(''));
    const inputRefs = useRef<TextInput[]>([]);


    // ✅ OTP jaisi functionality
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


    const handleSetPin = () => {
        if (pin.join('').length === 4) {
            navigation.navigate("AllSet");
        }
    };


    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >

            {/* Back */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Image
                    source={require('../../images/loginImage/back.png')}
                    style={styles.backIcon}
                />
            </TouchableOpacity>


            {/* Title */}
            <Text style={styles.title}>
                Create new pin
            </Text>


            {/* Image */}
            <Image
                source={require('../../images/loginImage/pin.png')}
                style={styles.image}
                resizeMode="contain"
            />


            {/* Box */}
            <View style={styles.box}>

                <Text style={styles.subtitle}>
                    Set a 4-digit PIN for quick and safe access.
                </Text>


                {/* PIN INPUTS */}
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

                            // ✅ backspace focus (OTP jaisa)
                            onKeyPress={({ nativeEvent }) => {
                                if (
                                    nativeEvent.key === 'Backspace' &&
                                    !pin[index] &&
                                    index > 0
                                ) {
                                    inputRefs.current[index - 1]?.focus();
                                }
                            }}

                            // ✅ only first auto focus (OTP jaisa)
                            autoFocus={index === 0}
                        />

                    ))}

                </View>


                {/* Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        { opacity: pin.join('').length === 4 ? 1 : 0.5 }
                    ]}
                    disabled={pin.join('').length < 4}
                    onPress={handleSetPin}
                >
                    <Text style={styles.buttonText}>
                        Set PIN
                    </Text>
                </TouchableOpacity>

            </View>

        </KeyboardAvoidingView>
    );
};

export default CreatePinScreen;



const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },


    backButton: {
        position: 'absolute',
        top: hp(59),
        left: wp(16),
        width: wp(41),
        height: wp(41),
        justifyContent: 'center',
        alignItems: 'center',
    },

    backIcon: {
        width: wp(38),
        height: wp(38),
    },


    title: {
        width: wp(331),
        height: hp(39),
        marginTop: hp(122),
        textAlign: 'center',
        fontSize: scaleFont(30),
        fontFamily: 'Urbanist-SemiBold',
        color: '#1E232C',
    },


    image: {
        width: wp(245),
        height: hp(204),
        marginTop: -hp(22),
    },


    box: {
        width: wp(357),
        height: hp(164),
        marginTop: hp(20),
        alignItems: 'center',
        gap: hp(30),
    },


    subtitle: {
        width: wp(304),
        height: hp(24),
        textAlign: 'center',
        fontFamily: 'Urbanist-Medium',
        fontSize: scaleFont(16),
        color: '#838BA1',
        marginTop: -hp(20),
    },


    pinRow: {
        width: wp(357),
        height: hp(35),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },


    pinInput: {
        width: wp(60),
        height: hp(40),
        borderBottomWidth: 2,
        borderColor: '#2288FD',
        textAlign: 'center',
        fontSize: scaleFont(18),
        color: '#000',
        fontFamily: 'Urbanist-SemiBold',
    },


    button: {
        width: wp(331),
        height: hp(45),
        borderRadius: wp(10),
        backgroundColor: '#2288FD',
        justifyContent: 'center',
        alignItems: 'center',
    },


    buttonText: {
        color: '#fff',
        fontSize: scaleFont(16),
        fontFamily: 'Urbanist-Medium',
    },

});