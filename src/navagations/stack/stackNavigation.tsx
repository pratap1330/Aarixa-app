// StackNavigator.tsx

import React from "react";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppTheme } from "../../hooks/useTheme";

import { RootStackParamList } from "../../utils/NavigationType/type";

import SplashScreen from "../../screens/splashScreen/splashScreen";
// import LoginScreen from "../../screens/auth/login";
import LoginScreen from "../../screens/auth/loginFlow";
import OtpVerificationScreen from "../../screens/auth/OTPVerification";
import CreatePinScreen from "../../screens/auth/createPin";
import AllSetScreen from "../../screens/auth/allSet";
import ExploreScreen from "../../screens/setting/exploreScreen";
import TabNavigator from "../tab/TabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const { mode } = useAppTheme();

  return (
    <NavigationContainer theme={mode === "dark" ? DarkTheme : DefaultTheme}>
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
          name="Explore"
          component={ExploreScreen}
          options={{ headerShown: false }}
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