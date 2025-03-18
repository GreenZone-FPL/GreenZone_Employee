import React from 'react';
import { createMotionTabs } from 'react-native-motion-tabs';
import { colors } from '../constants';
import HomeScreen from '../screens/bottom-navs/HomeScreen';
import ProfileScreen from '../screens/bottom-navs/ProfileScreen';


const Tabs = createMotionTabs({
  tabs: [
    {
      name: 'Đơn hàng',
      component: HomeScreen, 
      icon: 'document-text',
      iconType: 'Ionicons', 
    },
    {
      name: 'Cá nhân',
      component: ProfileScreen, 
      icon: 'person',
      iconType: 'Ionicons', 
    },
  ],
  style: {
    activeButton: colors.primary,
    activeText: colors.white, 
    inactiveText: colors.primary, 
    backgroundColor: colors.white, 
  },
});

export default function MainNavigation() {
  return <Tabs />; 
}
