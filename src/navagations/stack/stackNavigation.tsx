// StackNavigator.tsx

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../utils/NavigationType/type";

import SplashScreen from "../../screens/splashScreen/splashScreen";
// import LoginScreen from "../../screens/auth/login";
import LoginScreen from "../../screens/auth/loginFlow";
import OtpVerificationScreen from "../../screens/auth/OTPVerification";
import CreatePinScreen from "../../screens/auth/createPin";
import AllSetScreen from "../../screens/auth/allSet";

import TabNavigator from "../tab/TabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />

        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen
          name="OTPVerification"
          component={OtpVerificationScreen}
        />

        <Stack.Screen
          name="CreatePin"
          component={CreatePinScreen}
        />

        <Stack.Screen
          name="AllSet"
          component={AllSetScreen}
        />
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;