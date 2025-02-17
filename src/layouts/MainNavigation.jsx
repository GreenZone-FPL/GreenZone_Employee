import React from 'react';
import {createMotionTabs} from 'react-native-motion-tabs';
import HomeStackScreen from './stacks/HomeStackScreen';
import ProfileStackScreen from './stacks/ProfileStackScreen';
import {colors} from '../constants';

// Tạo thanh tabs và đặt vị trí của tab ở dưới cùng
const Tabs = createMotionTabs({
  tabs: [
    {
      name: 'Đơn hàng',
      component: HomeStackScreen, // Màn hình cho tab "Đơn hàng"
      icon: 'document-text', // Icon cho tab "Đơn hàng"
      iconType: 'Ionicons', // Loại icon
    },
    {
      name: 'Cá nhân',
      component: ProfileStackScreen, // Màn hình cho tab "Tài khoản"
      icon: 'person', // Icon cho tab "Tài khoản"
      iconType: 'Ionicons', // Loại icon
    },
  ],
  style: {
    activeButton: colors.primary, // Màu nền của nút khi tab được chọn
    activeText: colors.white, // Màu chữ khi tab được chọn
    inactiveText: colors.primary, // Màu chữ khi tab không được chọn
    backgroundColor: colors.white, // Màu nền của thanh tab
  },
});

export default function MainNavigation() {
  return <Tabs />; // Hiển thị các tab
}
