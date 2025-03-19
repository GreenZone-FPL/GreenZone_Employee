import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthGraph, MainGraph, OrderGraph } from './src/layouts/graphs';
import ShipperSocketService from './src/service/shipperSocketSevice';
import { AppAsyncStorage } from './src/utils';
import { AppContextProvider } from './src/context/appContext';
import { PaperProvider } from 'react-native-paper';
import { useAppContext } from './src/context/appContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import MainNavigation from './src/layouts/MainNavigation';
import SplashScreen from './src/screens/auth/SplashScreen';
import SplashScreen2 from './src/screens/auth/SplashScreen2';
import LoginScreen from './src/screens/auth/LoginScreen';
import DeliveryMapScreen from './src/screens/order/DeliveryMapScreen';
import ChatWithUser from './src/screens/order/ChatWithUser';
import OrderDetailScreen from './src/screens/order/OrderDetailScreen';
import CallWithUser from './src/screens/order/CallWithUser';
import OrderDoneScreen from './src/screens/order/OrderDoneScreen';
import UpdateProfileScreen from './src/screens/user-profile/UpdateProfileScreen';


const BaseStack = createNativeStackNavigator();

function App() {

  return (
    <AppContextProvider>
      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>

          <SafeAreaProvider>
            <NavigationContainer>
              <BaseStack.Navigator screenOptions={{ headerShown: false }}>
                <BaseStack.Screen name="AppNavigator" component={AppNavigator} />
              </BaseStack.Navigator>
            </NavigationContainer>
            <Toast />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PaperProvider>

    </AppContextProvider>


  );
}


function AppNavigator({ navigation }) {
  const { authState } = useAppContext();
  useEffect(() => {
    async function checkLoginStatus() {

      if (await AppAsyncStorage.isTokenValid()) {
        await initializeSocket();
      }
    }
    checkLoginStatus();
    return (() => {
      ShipperSocketService.disconnect()
    })
  }, [authState]);

  // Khởi tạo socket khi đăng nhập thành công
  const initializeSocket = async () => {
   
    await ShipperSocketService.initialize();

    // Lắng nghe sự kiện từ socket
    ShipperSocketService.on('order.assigned', data => {
      console.log(
        '📩 Nhận sự kiện order.assigned:',
        JSON.stringify(data, null, 2),
      );

      Toast.show({
        type: 'info',
        text1: '📦 Đơn hàng mới!',
        text2: `Mã đơn: ${data.orderId}`,
        position: 'top',
        visibilityTime: 3000,
      });

      console.log(`📌 Thử join vào room với orderId: ${data.orderId}`);
      ShipperSocketService.socket.emit('order.join', data.orderId);
    });

    ShipperSocketService.on('order.updateStatus', data => {
      console.log(
        '🔄 Trạng thái đơn hàng cập nhật:',
        JSON.stringify(data, null, 2),
      );
      Toast.show({
        type: 'info',
        text1: '📦 Đơn hàng mới!',
        text2: `Mã đơn: ${data.orderId}`,
        position: 'top',
        visibilityTime: 3000,
      });
    });
  };

  return (
    <BaseStack.Navigator screenOptions={{ headerShown: false }}>
      {!authState.needAuthen ? (
        <>
          {authState.needFlash && (
            <BaseStack.Screen
              name={AuthGraph.SplashScreen2}
              component={SplashScreen2}
            />
          )}
          <BaseStack.Screen name={MainGraph.graphName} component={MainNavigation} />
          <BaseStack.Screen name={AuthGraph.DeliveryMapScreen} component={DeliveryMapScreen} />
          <BaseStack.Screen name={AuthGraph.ChatWithUser} component={ChatWithUser} />
          <BaseStack.Screen name={OrderGraph.OrderDetailScreen} component={OrderDetailScreen} />
          <BaseStack.Screen name={AuthGraph.CallWithUser} component={CallWithUser} />
          <BaseStack.Screen name={OrderGraph.OrderDoneScreen} component={OrderDoneScreen} />
          <BaseStack.Screen name={'UpdateProfileScreen'} component={UpdateProfileScreen} />
        </>
      ) : (
        <>

          {authState.needFlash && (
            <BaseStack.Screen
              name={AuthGraph.SplashScreen}
              component={SplashScreen}
            />
          )}

          <BaseStack.Screen name={AuthGraph.LoginScreen} component={LoginScreen} />
        </>

      )}
    </BaseStack.Navigator>

  );
}

export default App;
