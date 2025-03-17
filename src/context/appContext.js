import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { AppAsyncStorage } from '../utils';
import { authReducer, authInitialState, AuthActionTypes } from '../reducers/authReducer';

export const AppContext = createContext();


export let globalAuthDispatch = null;

export let appDispatch = null;

export const AppContextProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);

  const [updateOrderMessage, setUpdateOrderMessage] = useState({ visible: false, order: null });
  const [activeOrders, setActiveOrders] = useState([]);


  useEffect(() => {
    const checkLoginStatus = async () => {
      const isValid = await AppAsyncStorage.isTokenValid();
      if (isValid) {
        authDispatch({ type: AuthActionTypes.LOGIN })
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
      authState, authDispatch, updateOrderMessage, setUpdateOrderMessage, activeOrders, setActiveOrders
    }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}