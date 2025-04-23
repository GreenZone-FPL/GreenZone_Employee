import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AppContextProvider, useAppContext } from './src/context/appContext';
import { AuthGraph, MainGraph, OrderGraph } from './src/layouts/graphs';
import ShipperSocketService from './src/service/shipperSocketSevice';

import LoginScreen from './src/screens/auth/LoginScreen';
import SplashScreen from './src/screens/auth/SplashScreen';
import SplashScreen2 from './src/screens/auth/SplashScreen2';
import CallWithUser from './src/screens/order/CallWithUser';
import ChatWithUser from './src/screens/order/ChatWithUser';
import DeliveryMapScreen from './src/screens/order/DeliveryMapScreen';
import OrderDetailScreen from './src/screens/order/OrderDetailScreen';

import BottomTab from './src/layouts/BottomTab';
import MapScreen from './src/screens/order/MapScreen';
import OrderDoneScreen from './src/screens/order/OrderDoneScreen';
import ProfileInfoScreen from './src/screens/user-profile/ProfileInfoScreen';

import {
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoUIKitPrebuiltCallWaitingScreen,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { AppAsyncStorage } from './src/utils';
import { onUserLoginZego } from './src/zego/common';
import ZegoCallUI from './src/zego/ZegoCallUI';

import { LogBox } from 'react-native';
import MyFlatList from './src/screens/user-profile/MyFlatList';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const BaseStack = createNativeStackNavigator();

function App() {

  return (
    <AppContextProvider>
      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>

          <SafeAreaProvider>
            <AppNavigator />
            <Toast />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PaperProvider>

    </AppContextProvider>


  );
}

function AppNavigator() {


  return (
    <NavigationContainer >

      <RootNavigator />
      <ZegoCallUI />

    </NavigationContainer>
  )
}

function RootNavigator() {
  return (
    <BaseStack.Navigator screenOptions={{ headerShown: false }}>
      <BaseStack.Screen name="MainNavigator" component={MainNavigator} />
      <BaseStack.Screen name={OrderGraph.OrderDetailScreen} component={OrderDetailScreen} />
    </BaseStack.Navigator>
  );
}


function MainNavigator() {
  const navigation = useNavigation()
  const { authState } = useAppContext();
  const slideFromBottomOption = {
    animation: 'slide_from_bottom',
    presentation: 'transparentModal',
    headerShown: false,
  };
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

  const initializeSocket = async () => {
    await ShipperSocketService.initialize();
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
          <BaseStack.Screen name={MainGraph.graphName} component={BottomTab} />

          <BaseStack.Screen
            options={{ headerShown: false }}
            // DO NOT change the name 
            name="ZegoUIKitPrebuiltCallWaitingScreen"
            component={ZegoUIKitPrebuiltCallWaitingScreen}
          />
          <BaseStack.Screen
            options={{ headerShown: false }}
            // DO NOT change the name
            name="ZegoUIKitPrebuiltCallInCallScreen"
            component={ZegoUIKitPrebuiltCallInCallScreen}
          />

          <BaseStack.Screen name={AuthGraph.DeliveryMapScreen} component={DeliveryMapScreen} />
          <BaseStack.Screen name={'MyFlatList'} component={MyFlatList} />
          <BaseStack.Screen name={AuthGraph.ChatWithUser} component={ChatWithUser} />
          <BaseStack.Screen name={OrderGraph.OrderDetailScreen} component={OrderDetailScreen} />
          <BaseStack.Screen
            name={'MapScreen'}
            component={MapScreen}
            options={slideFromBottomOption}
          />
          <BaseStack.Screen name={AuthGraph.CallWithUser} component={CallWithUser} />
          <BaseStack.Screen name={OrderGraph.OrderDoneScreen} component={OrderDoneScreen} />
          <BaseStack.Screen name={'ProfileInfoScreen'} component={ProfileInfoScreen} />
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
