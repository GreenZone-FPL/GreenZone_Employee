/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthGraph, MainGraph, OrderGraph} from './src/layouts/graphs';
import MainNavigation from './src/layouts/MainNavigation';
import SplashScreen from './src/screens/auth/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import VerifyOTPScreen from './src/screens/auth/VerifyOTPScreen';
import DeliveryMapScreen from './src/screens/delivery/DeliveryMapScreen';
import ChatWithUser from './src/screens/user/ChatWithUser';
import OrderDetailScreen from './src/screens/order/OrderDetailScreen';
import CallWithUser from './src/screens/user/CallWithUser';
import OrderDoneScreen from './src/screens/order/OrderDoneScreen';

const BaseStack = createNativeStackNavigator();
function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BaseStack.Navigator screenOptions={{headerShown: false}}>
          <BaseStack.Screen
            name={AuthGraph.SplashScreen}
            component={SplashScreen}
          />
          <BaseStack.Screen
            name={AuthGraph.LoginScreen}
            component={LoginScreen}
          />
          <BaseStack.Screen
            name={AuthGraph.VerifyOTPScreen}
            component={VerifyOTPScreen}
          />
          <BaseStack.Screen
            name={MainGraph.graphName}
            component={MainNavigation}
          />
          <BaseStack.Screen
            name={AuthGraph.DeliveryMapScreen}
            component={DeliveryMapScreen}
          />
          <BaseStack.Screen
            name={AuthGraph.ChatWithUser}
            component={ChatWithUser}
          />
          <BaseStack.Screen
            name={OrderGraph.OrderDetailScreen}
            component={OrderDetailScreen}
          />
          <BaseStack.Screen
            name={AuthGraph.CallWithUser}
            component={CallWithUser}
          />
          <BaseStack.Screen
            name={OrderGraph.OrderDoneScreen}
            component={OrderDoneScreen}
          />
        </BaseStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
