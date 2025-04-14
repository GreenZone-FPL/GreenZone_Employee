import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { AppAsyncStorage } from '../utils';
import { authReducer, authInitialState, AuthActionTypes } from '../reducers/authReducer';
import { onUserLoginZego } from '../zego/common';

export const AppContext = createContext();


export let globalAuthDispatch = null;

export let appDispatch = null;

export const AppContextProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);

  const [updateOrderMessage, setUpdateOrderMessage] = useState({ visible: false, order: null });
  const [orderDualStatuses, setOrderDualStatuses] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [showCallUI, setShowCallUI] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isValid = await AppAsyncStorage.isTokenValid();
      if (isValid) {
        authDispatch({ type: AuthActionTypes.LOGIN })
        const phoneNumber = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.phoneNumber);
        const lastName = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.lastName);
        if(phoneNumber && lastName){
          console.log('loginZego')
          await onUserLoginZego(phoneNumber, lastName);
        }
       
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    globalAuthDispatch = authDispatch;

    return () => { globalAuthDispatch = null; };
  }, [authState]);

 

  return (
    <AppContext.Provider value={{
      authState,
      authDispatch,
      updateOrderMessage,
      setUpdateOrderMessage,
      activeOrders,
      setActiveOrders,
      orderDualStatuses,
      setOrderDualStatuses,
      showCallUI,
      setShowCallUI
    }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}