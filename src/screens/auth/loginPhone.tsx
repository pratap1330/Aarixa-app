import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");

  const handleNext = () => {
    if (!phone) {
      Alert.alert("Enter phone number");
      return;
    }

    navigation.navigate("LoginFlow", { phoneNumber: phone });
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../images/splash/splash.png")}
        style={styles.logo}
      />

      {/* <Text style={styles.appLogo}>App LOGO</Text> */}

      {/* Login Text */}
      <Text style={styles.loginText}>Login</Text>

      {/* Input Box */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone number</Text>

        <View style={styles.inputRow}>
          {/* Flag */}
          <Image
            source={require("../../images/loginImage/india.png")}
            style={styles.flag}
          />

          <TextInput
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="number-pad"
            style={styles.input}
          />
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  logo: {
    width: 124,
    height: 117,
    marginTop: 80,
  },

  appLogo: {
    fontSize: 32,
    fontWeight: "800",
    marginTop: 10,
  },

  loginText: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 20,
    alignSelf: "flex-start",
    marginLeft: 16,
  },

  inputContainer: {
    width: 356,
    marginTop: 40,
  },

  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },

  flag: {
    width: 24,
    height: 16,
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 14,
  },

  button: {
    width: 356,
    height: 45,
    backgroundColor: "#2288FD",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});