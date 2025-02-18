import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../../screens/bottom-navs/HomeScreen';
import OrderHistoryScreen from '../../screens/order/OrderHistoryScreen';
import VerifyOTPScreen from '../../screens/auth/VerifyOTPScreen';
import {AuthGraph, BottomGraph, OrderGraph} from '../graphs';

const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name={BottomGraph.HomeScreen} component={HomeScreen} />

      <HomeStack.Screen
        name={AuthGraph.VerifyOTPScreen}
        component={VerifyOTPScreen}
      />
      <HomeStack.Screen
        name={OrderGraph.OrderHistoryScreen}
        component={OrderHistoryScreen}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
