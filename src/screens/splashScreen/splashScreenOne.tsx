import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import WealthLogo from '../../images/splash/wealthlogo.svg';
import { RootStackParamList } from '../../utils/NavigationType/type';
import { hp, scaleFont, wp } from '../../utils/responcive/responcive';

type Props = NativeStackScreenProps<RootStackParamList, 'SplashScreenOne'>;
const MANAGEMENT_TEXT = 'Management';

const SplashScreenOne: React.FC<Props> = ({ navigation }) => {
  const [typedManagement, setTypedManagement] = useState('');
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(hp(26))).current;
  const logoTranslateX = useRef(new Animated.Value(wp(8))).current;
  const logoScale = useRef(new Animated.Value(0.96)).current;
  const managementOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let typingTimeout: ReturnType<typeof setTimeout> | undefined;
    let startTypingTimeout: ReturnType<typeof setTimeout> | undefined;
    let navigateTimeout: ReturnType<typeof setTimeout> | undefined;

    const delayTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateX, {
          toValue: -wp(14),
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      startTypingTimeout = setTimeout(() => {
        Animated.timing(managementOpacity, {
          toValue: 1,
          duration: 120,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();

        let index = 0;
        const typeNextCharacter = () => {
          index += 1;
          setTypedManagement(MANAGEMENT_TEXT.slice(0, index));

          if (index < MANAGEMENT_TEXT.length) {
            typingTimeout = setTimeout(typeNextCharacter, 100);
            return;
          }

          navigateTimeout = setTimeout(() => {
            navigation.replace('SplashScreen');
          }, 350);
        };

        typingTimeout = setTimeout(typeNextCharacter, 1000);
      }, 220);
    }, 800);

    return () => {
      clearTimeout(delayTimer);
      if (startTypingTimeout) {
        clearTimeout(startTypingTimeout);
      }
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      if (navigateTimeout) {
        clearTimeout(navigateTimeout);
      }
    };
  }, [
    logoOpacity,
    logoScale,
    logoTranslateX,
    logoTranslateY,
    managementOpacity,
    navigation,
  ]);

  return (
    <LinearGradient
      colors={['#165CCE', '#1E3696']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { translateY: logoTranslateY },
                  { translateX: logoTranslateX },
                ],
              },
            ]}
          >
            <View style={styles.wealthClip}>
              <WealthLogo width={wp(323)} height={hp(49)} />
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.managementWrap,
              {
                opacity: managementOpacity,
                transform: [{ translateY: logoTranslateY }],
              },
            ]}
          >
            <Text style={styles.managementText}>{typedManagement}</Text>
          </Animated.View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SplashScreenOne;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    // alignItems: 'center'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(24),
    marginLeft:wp(28)
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -wp(18),
  },
  logoWrapper: {
    width: wp(112), // Reduced from 120 to crop the vertical line
    height: hp(39),
    alignItems: 'center',
    justifyContent: 'center',
  },
  wealthClip: {
    width: wp(112), // Reduced from 121 to crop the vertical line
    height: hp(39),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  managementWrap: {
    marginLeft: -wp(9), // Increased negative margin to remove the gap
    minWidth: wp(176),
    height: hp(39),
    justifyContent: 'center',
  },
  managementText: {
    color: '#9DBDFF',
    fontSize: scaleFont(30),
    lineHeight: scaleFont(37),
    fontStyle: 'italic',
    fontFamily: 'Urbanist-Regular',
    letterSpacing: -0.5,
  },
});