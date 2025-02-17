import {AppGraph} from './appGraph';

// Graph chứa các màn hình cho Authentication
// Splash, Login, ChangePassword, OTP,...
export const AuthGraph = Object.freeze({
  graphName: AppGraph.AUTHENTICATION,

  SplashScreen: 'SplashScreen',
  LoginStepOneScreen: 'LoginStepOneScreen',
  LoginStepTwoScreen: 'LoginStepTwoScreen',

  LoginScreen: 'LoginScreen',
  DeliveryMapScreen: 'DeliveryMapScreen',
  ChatWithUser: 'ChatWithUser',
  CallWithUser: 'CallWithUser',
});
