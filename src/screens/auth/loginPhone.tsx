import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from '../../utils/NavigationType/type';
import India from '../../images/loginImage/india.svg';
import Ionicons from "react-native-vector-icons/Ionicons";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import {
  getBiometricStatus,
  isBiometricLoginEnabled,
  promptBiometricVerification,
} from "../../services/biometric/biometricService";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Base design width from Figma = 390px
const BASE_WIDTH = 390;
const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

type Props = NativeStackScreenProps<RootStackParamList, "LoginPhone">;

const LoginPhone: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState("Biometric");
  const [canUseBiometricLogin, setCanUseBiometricLogin] = useState(false);

  const handleProceed = () => {
    if (!phone || phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }
    navigation.navigate("Login");
  };

  const hydrateBiometricAccess = useCallback(async () => {
    try {
      const [storedUser, biometricEnabled, biometricStatus] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.user),
        isBiometricLoginEnabled(),
        getBiometricStatus(),
      ]);

      setBiometricLabel(biometricStatus.label);
      setCanUseBiometricLogin(
        Boolean(storedUser) && biometricEnabled && biometricStatus.available,
      );
    } catch {
      setCanUseBiometricLogin(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      hydrateBiometricAccess();
    }, [hydrateBiometricAccess]),
  );

  const handleBiometricLogin = async () => {
    const isVerified = await promptBiometricVerification(
      `Login securely with ${biometricLabel}`,
    );

    if (!isVerified) {
      Alert.alert(
        "Verification cancelled",
        `Use your ${biometricLabel.toLowerCase()} or continue with manual login.`,
      );
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "Tabs" }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>

        {/* ── App Logo ── */}
        {/* Swap the Text below with your <Image> once splash is ready */}
<Image
  source={require("../../images/splash/splash.png")}
  style={styles.appLogo}
/>
        {/* ── Login Heading ── */}
        <Text style={styles.loginText}>Login</Text>

        {/* ── Phone Number Input Group ── */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone number</Text>

          <View style={styles.inputRow}>
            {/* Country flag box */}
           <View style={styles.flagBox}>
  <India style={styles.flagImage} />
</View>

            {/* Phone input field */}
            <TextInput
              style={[
                styles.phoneInput,
                isFocused && styles.phoneInputFocused,
              ]}
              placeholder="Add your phone number"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={setPhone}
              keyboardType="number-pad"
              maxLength={10}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              returnKeyType="done"
            />
          </View>
        </View>

        {/* ── Proceed Button ── */}
        <TouchableOpacity
          style={[styles.proceedBtn, !phone && styles.proceedBtnDisabled]}
          onPress={handleProceed}
          activeOpacity={0.85}
        >
          <Text style={styles.proceedText}>Proceed</Text>
        </TouchableOpacity>

        {canUseBiometricLogin ? (
          <TouchableOpacity
            style={styles.biometricBtn}
            onPress={handleBiometricLogin}
            activeOpacity={0.85}
          >
            <Ionicons name="finger-print-outline" size={scale(20)} color="#2288FD" />
            <Text style={styles.biometricBtnText}>Continue with {biometricLabel}</Text>
          </TouchableOpacity>
        ) : null}

        {/* ── Forgot Password ── */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword" as never)}
          activeOpacity={0.7}
          style={styles.forgotWrapper}
        >
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default LoginPhone
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: scale(16),
    alignItems: "center",
  },

  // ── Logo ──────────────────────────────────────────
  appLogo: {
    marginTop: scale(80),
    width: scale(194),
    height: scale(117),
    resizeMode: "contain",
    tintColor: "#2288FD",
  },

  // ── Login title ───────────────────────────────────
  loginText: {
    marginTop: scale(20),
    alignSelf: "center",
    fontFamily: Platform.OS === "ios" ? "Urbanist-Bold" : "Urbanist-Medium",
    fontWeight: "700",
    fontSize: scale(30),
    lineHeight: scale(39),
    letterSpacing: -0.3,
    color: "#1E232C",
  },

  // ── Input group ───────────────────────────────────
  inputGroup: {
    width: scale(356),
    marginTop: scale(120),
  },
  flagImage: {
  width: scale(32),
  height: scale(24),
  resizeMode: "contain",
  borderRadius: scale(2),
},

  inputLabel: {
    fontFamily: "Urbanist-Medium",
    // fontWeight: "400",
    fontSize: scale(14),
    lineHeight: scale(14),
    color: "#6B7280",
    marginBottom: scale(6),
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: scale(343),
  },

  flagBox: {
    width: scale(50),
    height: scale(44),
    backgroundColor: "#FFFFFF",
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  phoneInput: {
    width: scale(283),
    height: scale(44),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingTop: scale(10),
    paddingBottom: scale(10),
    paddingLeft: scale(12),
    paddingRight: scale(12),
    fontFamily: "Urbanist-Medium",
    // fontWeight: "400",
    fontSize: scale(16),
    color: "#1E232C",
    backgroundColor: "#FFFFFF",
  },

  phoneInputFocused: {
    borderColor: "#007AFF",
    borderWidth: 1.5,
  },

  // ── Proceed button ────────────────────────────────
  proceedBtn: {
    width: scale(356),
    height: scale(45),
    backgroundColor: "#2288FD",
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
    marginTop: scale(15),
  },

  proceedBtnDisabled: {
    opacity: 0.6,
  },

  proceedText: {
    fontFamily: "Urbanist-Medium",
    fontWeight: "600",
    fontSize: scale(15),
    lineHeight: scale(15),
    color: "#FFFFFF",
    textAlign: "center",
  },

  biometricBtn: {
    width: scale(356),
    height: scale(48),
    borderRadius: scale(12),
    borderWidth: 1.2,
    borderColor: "#2288FD",
    marginTop: scale(14),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: scale(10),
    backgroundColor: "#F7FAFF",
  },

  biometricBtnText: {
    fontFamily: "Urbanist-SemiBold",
    fontSize: scale(15),
    color: "#2288FD",
  },

  // ── Forgot password ───────────────────────────────
  forgotWrapper: {
    marginTop: scale(24),
  },

  forgotText: {
    fontFamily: "Urbanist-Medium",
    fontWeight: "600",
    fontSize: scale(15),
    lineHeight: scale(21),
    letterSpacing: 0.15,
    color: "#2288FD",
    textAlign: "center",
  },
});
