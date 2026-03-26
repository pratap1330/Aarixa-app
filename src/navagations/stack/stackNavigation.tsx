import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../utils/NavigationType/type';

import SplashScreen from '../../screens/splashScreen/splashScreen';
import LoginScreen from '../../screens/auth/login';
import OtpVerificationScreen from '../../screens/auth/OTPVerification';
import CreatePinScreen from '../../screens/auth/createPin';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }} // ✅ yaha aayega
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;