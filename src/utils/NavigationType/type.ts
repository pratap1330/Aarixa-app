export type RootStackParamList = {
  // Login: undefined;
  SplashScreen: undefined;
  SplashScreenOne: undefined;
  LoginIntro: undefined;
  LoginPhone : {
    phone :string};
  // Login: {
  //   phone :string}
  //   ;
  Login:undefined
  OTPVerification: {
    username: string;
    password: string;
    phone :string;
  };

  CreatePin: {
    username: string;
    password: string;
    // otp: string;
    // phone :string;
  };
  UnlockPin: undefined;

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
