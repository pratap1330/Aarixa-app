import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import SplashLogoLogin from '../../images/splash/spaashlogologin.svg';
import Watermark from '../../images/splash/watermark.svg';
import WealthLogo from '../../images/splash/wealthlogo.svg';
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
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#165CCE" />

        <View style={styles.content}>
          <View style={styles.heroGroup}>
            <View style={styles.brandWrap}>
              <SplashLogoLogin width={wp(35)} height={hp(35)} />
              <View style={styles.brandLogoWrap}>
                <WealthLogo width={wp(221)} height={hp(47)} />
              </View>
            </View>

            <View style={styles.copyBlock}>
              <Text style={styles.title}>Invest Today.</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit style={styles.subtitle}>
                Live Better Tomorrow.
              </Text>
            </View>

            <Text style={styles.description}>
              Thousands of families are already growing their wealth the smart
              way. With expert guidance, zero confusion, and complete
              transparency - your financial freedom is just one step away.
            </Text>
          </View>

          <View >
            <Watermark width={wp(695)} height={hp(397)} />
          </View>

          <View style={styles.bottomSheetWrap}>
            <Svg
              pointerEvents="none"
              width="100%"
              height={hp(72)}
              viewBox="0 0 100 72"
              preserveAspectRatio="none"
              style={styles.bottomSheetCurve}
            >
              <Path
                d="M0,72 C10,30 28,14 50,10 C72,14 90,30 100,72 L100,72 L0,72 Z"
                fill="#FFFFFF"
              />
            </Svg>

          <View style={styles.bottomSheet}>
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

            {/* <TouchableOpacity
              activeOpacity={0.9}
              style={styles.phoneButton}
              onPress={() => navigation.navigate('LoginPhone')}
            >
              <Text style={styles.phoneButtonText}>Login with phone</Text>
            </TouchableOpacity> */}
          </View>
          </View>
        </View>
      </SafeAreaView>
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
    overflow: 'hidden',
  },
  heroGroup: {
    width: wp(350),
    height: hp(176),
    marginTop: hp(61),
    marginLeft: wp(30),
    zIndex: 2,
  },
  brandWrap: {
    width: wp(267),
    height: hp(47),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  brandLogoWrap: {
    marginLeft: wp(11),
  },
  copyBlock: {
    width: wp(350),
    height: hp(99),
    marginTop: hp(40),
  },
  title: {
    color: '#FFFFFF',
    fontSize: scaleFont(48),
    lineHeight: scaleFont(60),
    fontFamily: 'Reddit Sans',
  },
  subtitle: {
    marginTop: hp(2),
    width: wp(290),
    color: '#BFD1FF',
    fontSize: scaleFont(32),
    lineHeight: scaleFont(45),
    fontStyle: 'italic',
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
      default: 'serif',
    }),
  },
  description: {
    width: wp(350),
    maxWidth: wp(350),
    marginTop: hp(20),
    color: '#9DBDFF',
    fontSize: scaleFont(18),
    lineHeight: scaleFont(24),
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
      default: 'serif',
    }),
    fontWeight: '500',
  },
  // watermark: {
  //   position: 'absolute',
  //   width: wp(695),
  //   height: hp(397),
  //   top: hp(74),
  //   left: -wp(294),
  //   opacity: 0.03,
  //   transform: [{ rotate: '180deg' }],
  //   zIndex: 1,
  // },
  bottomSheetWrap: {
    position: 'absolute',
    left: -50,
    right: -50,
    bottom: 0,
    height: hp(404),
  },
  bottomSheetCurve: {
    position: 'absolute',
    // top: -hp(0),
    left: 0,
    right: 0,
    zIndex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    left: -wp(18),
    right: -wp(18),
    bottom: 0,
    height: hp(344),
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp(50),
    borderTopRightRadius: wp(50),
    paddingTop: hp(159),
    paddingHorizontal: wp(30),
    zIndex: 2,
  },
  loginButton: {
    width: wp(330),
    height: hp(45),
    alignSelf: 'center',
    borderRadius: wp(10),
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 5,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  phoneButton: {
    width: wp(330),
    height: hp(45),
    alignSelf: 'center',
    marginTop: hp(14),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: '#165CCE',
    // background: linear-gradient(180deg, #165CCE 0%, #1E3696 100%);

    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(10),
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: scaleFont(15),
    lineHeight: scaleFont(18),
    fontFamily: 'Urbanist-Bold',
  },
  phoneButtonText: {
    color: '#2B5ED7',
    fontSize: scaleFont(15),
    lineHeight: scaleFont(18),
    fontFamily: 'Urbanist-Bold',
  },
});
