export type RootStackParamList = {
  Login: undefined;

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
}

export type TabParamList = {
  dashboard: undefined;
  invest: undefined;
  ai: undefined;
  history: undefined;
};