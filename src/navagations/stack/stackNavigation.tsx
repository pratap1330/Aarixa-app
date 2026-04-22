// StackNavigator.tsx

import React from "react";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppTheme } from "../../hooks/useTheme";

import { RootStackParamList } from "../../utils/NavigationType/type";

import SplashScreen from "../../screens/splashScreen/splashScreen";
import SplashScreenOne from "../../screens/splashScreen/splashScreenOne";
// import LoginScreen from "../../screens/auth/login";
import LoginScreen from "../../screens/auth/loginFlow";
import LoginPhone from '../../screens/auth/loginPhone'
import OtpVerificationScreen from "../../screens/auth/OTPVerification";
import CreatePinScreen from "../../screens/auth/createPin";
import UnlockPinScreen from "../../screens/auth/unlockPin";
import AllSetScreen from "../../screens/auth/allSet";
import ExploreScreen from "../../screens/setting/exploreScreen";
import TabNavigator from "../tab/TabNavigator";
import ReportsScreen from "../../screens/setting/report/reportScreen";
import ShipDetailsScreen from '../../screens/setting/sipDetails/sipStpDetails'

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const { mode } = useAppTheme();

  return (
    <NavigationContainer theme={mode === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        initialRouteName="SplashScreenOne"
        screenOptions={{ headerShown: false }}
      >
        {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}
        <Stack.Screen name="SplashScreenOne" component={SplashScreenOne} />

        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen
          name="OTPVerification"
          component={OtpVerificationScreen}
        />


          <Stack.Screen
          name="LoginPhone"
          component={LoginPhone}
        />

        <Stack.Screen
          name="CreatePin"
          component={CreatePinScreen}
        />
        <Stack.Screen
          name="UnlockPin"
          component={UnlockPinScreen}
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
          name="SipDetailsScreen"
          component={ShipDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
        />

        <Stack.Screen name="reports" component={ReportsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
