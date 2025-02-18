import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ProfileScreen from '../../screens/bottom-navs/ProfileScreen';
import EditProfile from '../../screens/user-profile/EditProfile';
import {MainGraph, BottomGraph} from '../graphs';
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
      <ProfileStack.Screen name={'EditProfile'} component={EditProfile} />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackScreen;
