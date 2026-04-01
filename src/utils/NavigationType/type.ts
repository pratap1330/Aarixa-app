export type RootStackParamList = {
  Login: undefined;
 SplashScreen: undefined;
  OTPVerification: {
    username: string;
    password: string;
  };

  CreatePin: {
    username: string;
    password: string;
    otp: string;
  };

  AllSet: undefined;
  Tabs: undefined; 
  Explore :undefined
}


export type TabParamList = {
  dashboard: undefined;
  invest: undefined;
  ai: undefined;
  history: undefined;
};