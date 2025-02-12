import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { colors, GLOBAL_KEYS } from '../constants';
import { MainGraph } from './graphs';
import HomeStackScreen from './stacks/HomeStackScreen';
import ProfileStackScreen from './stacks/ProfileStackScreen';

const BottomTab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <BottomTab.Navigator
      initialRouteName={MainGraph.HomeStackScreen}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: colors.white,
          maxHeight: 80,
          height: 60,
        },
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === MainGraph.HomeStackScreen) {
            iconName = focused ? 'text-box' : 'text-box-outline';
          }
          else if (route.name === MainGraph.ProfileStackScreen) {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          }

          return (
            <Icon
              source={iconName}
              color={focused ? colors.primary : colors.gray700}
              size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
            />
          );
        },
        tabBarLabel: ({ focused }) => {
          let label;

          if (route.name === MainGraph.HomeStackScreen) {
            label = 'Đơn hàng';
          } else if (route.name === MainGraph.ProfileStackScreen) {
            label = 'Cá nhân';
          }

          return (
            <Text style={{ color: focused ? colors.primary : colors.gray700, fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL }}>
              {label}
            </Text>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray700,
      })}>
      <BottomTab.Screen
        name={MainGraph.HomeStackScreen}
        component={HomeStackScreen}

      />
      <BottomTab.Screen
        name={MainGraph.ProfileStackScreen}
        component={ProfileStackScreen}
      />
    </BottomTab.Navigator>
  );
};

export default MainNavigation;
