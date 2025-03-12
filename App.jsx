/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState, useEffect } from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthGraph, MainGraph, OrderGraph} from './src/layouts/graphs';
import MainNavigation from './src/layouts/MainNavigation';
import SplashScreen from './src/screens/auth/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import DeliveryMapScreen from './src/screens/delivery/DeliveryMapScreen';
import ChatWithUser from './src/screens/user/ChatWithUser';
import OrderDetailScreen from './src/screens/order/OrderDetailScreen';
import CallWithUser from './src/screens/user/CallWithUser';
import OrderDoneScreen from './src/screens/order/OrderDoneScreen';
import Toast, {BaseToast} from 'react-native-toast-message';
import ShipperSocketService from './src/service/shipperSocketSevice'; // Đã sửa lỗi tên thư mục
import AppAsyncStorage from './src/utils'; 

const BaseStack = createNativeStackNavigator();

 

function App() {
 const [isLoggedIn, setIsLoggedIn] = useState(false);

 // Kiểm tra trạng thái đăng nhập
 useEffect(() => {
   async function checkLoginStatus() {
     const userToken = await AppAsyncStorage.readData('userToken');
     if (userToken) {
       setIsLoggedIn(true);
       initializeSocket(); // Nếu đã đăng nhập, khởi tạo socket
     }
   }
   checkLoginStatus();
 }, []);

 // Khởi tạo socket khi đăng nhập thành công
const initializeSocket = () => {
  console.log('🔌 Đang khởi tạo socket...');
  ShipperSocketService.initialize();

  // Kiểm tra xem socket có đang kết nối không
  ShipperSocketService.socket.on('connect', () => {
    console.log('✅ Socket đã kết nối:', ShipperSocketService.socket.id);
  });

  ShipperSocketService.socket.on('disconnect', () => {
    console.log('❌ Socket bị ngắt kết nối');
  });

  ShipperSocketService.on('order.assigned', data => {
    console.log(
      '📩 Nhận được sự kiện order.assigned:',
      JSON.stringify(data, null, 2),
    );

    Toast.show({
      type: 'info',
      text1: '📦 Đơn hàng mới',
      text2: `Mã đơn: ${data.orderId}`,
      position: 'top',
      visibilityTime: 3000,
    });

    // join vào room ngay sau khi nhận đơn hàng
    console.log(`📌 Thử join vào room với orderId: ${data.orderId}`);
    ShipperSocketService.socket.emit('order.join', data.orderId);
  });
};


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
      <Toast />
    </SafeAreaProvider>
  );
}

export default App;
