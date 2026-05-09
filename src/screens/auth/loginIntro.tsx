import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/NavigationType/type';
import { hp, scaleFont, wp } from '../../utils/responcive/responcive';

type Props = NativeStackScreenProps<RootStackParamList, 'LoginIntro'>;

const LoginIntro: React.FC<Props> = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#165CCE', '#1E3696']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <View style={styles.safeArea}>
        {/* Set translucent to true to allow background to flow behind status bar */}
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <View style={styles.content}>
          {/* Top Right Decoration - Increased Size */}
          <View style={styles.topDecor}>
            <Image 
              source={require('../../images/loginImage/ruppe1.png')} 
              style={styles.topImage} 
              resizeMode="contain" 
            />
          </View>

          {/* Middle Left Decoration - Positioned above the white sheet */}
          <View style={styles.middleDecor}>
            <Image 
              source={require('../../images/loginImage/rupee2.png')} 
              style={styles.bottomImage} 
              resizeMode="contain" 
            />
          </View>

          <View style={styles.bottomSheet}>
            {/* Using a Container to manage spacing instead of 'bottom' property */}
            <View style={styles.textContent}>
              <Text numberOfLines={1} style={styles.title}>
                Welcome to Wealthsys
              </Text>
              <Text style={styles.subtitle}>
                Smart financial management designed for modern investors
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <LinearGradient
                colors={['#2F6DE6', '#2244A8']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.loginButtonGradient}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default LoginIntro;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  topDecor: {
    position: 'absolute',
    top: hp(60), // Positioned relative to top
    right: -wp(15), // Offset to match Figma tilt
    zIndex: 1,
  },
  topImage: {
    width: wp(160), // Increased size
    height: wp(160),
  },
  middleDecor: {
    position: 'absolute',
    width: wp(160), // Increased size
    height: wp(220),
    top: hp(230), // 
    zIndex: 1,
  },
  bottomImage: {
   
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: hp(420), // Height of the white section
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp(40),
    borderTopRightRadius: wp(40),
    paddingHorizontal: wp(30),
    alignItems: 'center',
    justifyContent: 'center', // Centers text and button vertically
    zIndex: 2,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: hp(40),
  },
  title: {
    color: '#000000',
    fontSize: scaleFont(28),
    fontFamily: 'Urbanist-ExtraBold',
    textAlign: 'center',
    width: wp(324),
    marginBottom: hp(10),
  },
  subtitle: {
    color: '#000000',
    fontSize: scaleFont(16),
    lineHeight: scaleFont(24),
    textAlign: 'center',
    fontFamily: 'Urbanist-Regular',
    width: wp(320),
  },
  loginButton: {
    width: wp(330),
    height: hp(52),
    borderRadius: wp(80),
    // Standard shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(80),
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: scaleFont(16),
    fontFamily: 'Urbanist-Bold',
  },
});