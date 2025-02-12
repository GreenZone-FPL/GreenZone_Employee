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
import {AuthGraph, MainGraph} from './src/layouts/graphs';
import MainNavigation from './src/layouts/MainNavigation';

import LoginStepOneScreen from './src/screens/auth/LoginStepOneScreen';
import LoginStepTwoScreen from './src/screens/auth/LoginStepTwoScreen';

import LoginScreen from './src/screens/auth/LoginScreen';
import DeliveryMapScreen from './src/screens/delivery/DeliveryMapScreen';
import ChatWithUser from './src/screens/user/ChatWithUser';


const BaseStack = createNativeStackNavigator();
function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BaseStack.Navigator screenOptions={{headerShown: false}}>
          <BaseStack.Screen
            name={AuthGraph.LoginStepOneScreen}
            component={LoginStepOneScreen}
          />
          <BaseStack.Screen
            name={AuthGraph.LoginStepTwoScreen}
            component={LoginStepTwoScreen}
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
        </BaseStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
