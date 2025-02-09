import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoginStepTwoScreen from '../../screens/auth/LoginStepTwoScreen';
import ProfileScreen from '../../screens/bottom-navs/ProfileScreen';
import {AuthGraph, BottomGraph, MainGraph} from '../graphs';

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator
      name={MainGraph.ProfileStackScreen}
      screenOptions={{headerShown: false}}>
      <ProfileStack.Screen
        name={BottomGraph.ProfileScreen}
        component={ProfileScreen}
      />
      <ProfileStack.Screen
        name={AuthGraph.LoginStepTwoScreen}
        component={LoginStepTwoScreen}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackScreen;
