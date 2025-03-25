import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AppContextProvider, useAppContext } from './src/context/appContext';
import { AuthGraph, MainGraph, OrderGraph } from './src/layouts/graphs';
import ShipperSocketService from './src/service/shipperSocketSevice';
import { AppAsyncStorage } from './src/utils';

import MainNavigation from './src/layouts/MainNavigation';
import LoginScreen from './src/screens/auth/LoginScreen';
import SplashScreen from './src/screens/auth/SplashScreen';
import SplashScreen2 from './src/screens/auth/SplashScreen2';
import CallWithUser from './src/screens/order/CallWithUser';
import ChatWithUser from './src/screens/order/ChatWithUser';
import DeliveryMapScreen from './src/screens/order/DeliveryMapScreen';
// import OrderDetailScreen from './src/screens/order/OrderDetailScreen';
import OrderDetailScreen from './src/screens/order/orderdetail/OrderDetailScreen';

import OrderDoneScreen from './src/screens/order/OrderDoneScreen';
import UpdateProfileScreen from './src/screens/user-profile/UpdateProfileScreen';
// LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
// LogBox.ignoreAllLogs();//Ignore all log notifications

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
