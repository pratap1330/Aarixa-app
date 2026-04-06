export type RootStackParamList = {
  // Login: undefined;
  SplashScreen: undefined;
  LoginPhone :undefined;
Login: {
  phone: string;
};
  OTPVerification: {
    username: string;
    password: string;
    phone :string;
  };

  CreatePin: {
    username: string;
    password: string;
    otp: string;
  };

  AllSet: undefined;
  Tabs: undefined; 
  Explore :undefined;
  reports :undefined;
  SipDetailsScreen : undefined;
}


export type TabParamList = {
  dashboard: undefined;
  invest: undefined;
  ai: undefined;
  history: undefined;
};