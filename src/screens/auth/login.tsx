  import React, { useState, useEffect } from 'react';
  import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    Modal,
    Dimensions,
    Platform,
  } from 'react-native';
  import { NativeStackScreenProps } from '@react-navigation/native-stack';
  import { RootStackParamList } from '../../utils/NavigationType/type';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

  type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

  interface Country {
    name: string;
    code: string;
    flag: any;
  }

  const countries: Country[] = [
    { name: 'India', code: '+91', flag: require('../../images/loginImage/india.png') },
  ];

  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

  const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [phone, setPhone] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
      // Button enable/disable based on input length only
      if (phone.length === 10) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    }, [phone]);

    const handleLogin = () => {
    // Remove any non-digit characters from input
    const cleanedPhone = phone.replace(/\D/g, '');

    if (cleanedPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError('');

    // Navigate to OTPVerification screen
    // navigation.navigate('OTPVerification');
  };

    const selectCountry = (country: Country) => {
      setSelectedCountry(country);
      setModalVisible(false);
    };

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        extraHeight={Platform.OS === 'android' ? 120 : 0}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          Enter your phone number to receive a{"\n"}6-digit code to verify
        </Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Phone Number</Text>

          <TouchableOpacity
            style={styles.countrySelector}
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={selectedCountry.flag}
              style={styles.flag}
              resizeMode="contain"
            />
            <Text style={styles.countryCode}>{selectedCountry.code}</Text>
            <Image
              source={require('../../images/loginImage/arrow.png')}
              style={styles.arrow}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.lineWrapper}>
            <Image
              source={require('../../images/loginImage/Line.png')}
              style={styles.lineImage}
              resizeMode="contain"
            />
          </View>

          <TextInput
            placeholder="Enter phone number"
            placeholderTextColor="#838BA1"
            keyboardType="phone-pad"
            underlineColorAndroid="transparent"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            maxLength={10}
            autoFocus={true}
          />



          {/* Error text show only after button click */}
          <View style={{ minHeight: 18 }}>
            {error.length > 0 && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>
        

        <TouchableOpacity
          style={[styles.button, isButtonDisabled && { backgroundColor: '#ccc' }]}
          onPress={handleLogin}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Send Code</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={countries}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.countryItem}
                    onPress={() => selectCountry(item)}
                  >
                    <Image source={item.flag} style={styles.flag} resizeMode="contain" />
                    <Text style={styles.countryCode}>{item.code}</Text>
                    <Text style={styles.countryName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    );
  };

  export default LoginScreen;

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      paddingHorizontal: 16,
      backgroundColor: '#fff',
      paddingBottom: 50,
    },
    title: {
      marginTop: SCREEN_WIDTH * 0.25,
      fontFamily: 'Urbanist-Bold',
      fontSize: scaleFont(30),
      lineHeight: scaleFont(39),
      letterSpacing: -0.3,
      color: '#1E232C',
      textAlign: 'center',
    },
    subtitle: {
      marginTop: 12,
      paddingTop: 42,
      fontFamily: 'Urbanist-Medium',
      fontSize: scaleFont(16),
      lineHeight: scaleFont(24),
      color: '#838BA1',
      textAlign: 'center',
    },
    inputWrapper: {
      marginTop: 80,
      width: '90%',
      fontFamily: 'Urbanist-Regular',
      maxWidth: 356,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: '#2288FD',
      height: 55,
      paddingHorizontal: 0,
    },
    inputLabel: {
      position: 'absolute',
      top: -20,
      left: 0,
      fontFamily: 'Urbanist-Medium',
      fontSize: 14,
      lineHeight: 18,
      color: 'rgba(142,142,147,1)',
      backgroundColor: '#fff',
      paddingHorizontal: 2,
      zIndex: 1,
    },
    countrySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
    },
    flag: { width: 25, height: 25, marginRight: 5 },
    countryCode: {
      fontFamily: 'Urbanist-Medium',
      fontSize: 14,
      marginRight: 5,
    },
    arrow: { width: 16, height: 7 },
    input: {
      flex: 1,
      fontFamily: 'Urbanist-Medium',
      fontSize: 14,
      lineHeight: 18,
      color: '#000',
      paddingVertical: 0,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 2,
      marginLeft: 5,
    },
    button: {
      marginTop: 25,
      width: '90%',
      maxWidth: 331,
      height: 45,
      backgroundColor: '#2288FD',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontFamily: 'Urbanist-Medium',
      fontSize: scaleFont(16),
      color: '#fff',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 10,
      maxHeight: '60%',
    },
    countryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E8ECF4',
    },
    countryName: {
      marginLeft: 8,
      fontSize: scaleFont(14),
      color: '#1E232C',
    },
    closeButton: {
      padding: 12,
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#2288FD',
      fontSize: scaleFont(16),
    },
    lineImage: {
      width: 2,
      height: 20,
      opacity: 1,
    },
    lineWrapper: {
      width: 2,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });