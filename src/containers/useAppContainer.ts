import { useEffect, useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import { useAppContext } from '../context/appContext';
import shipperSocketSevice from '../service/shipperSocketSevice';
import { AppAsyncStorage } from '../utils';

export const useAppContainer = () => {
  const { orderUpdate, setOrderUpdate, authState} = useAppContext();
  const [tokenValid, setTokenValid] = useState<boolean>(false);
  const [loadingSplash, setLoadingSplash] = useState<boolean>(true);


  const updateOrderCallBack = (data: any) => {
    console.log('updateOrder', data);
    setOrderUpdate(data);
  };

  useEffect(() => {

    shipperSocketSevice.initialize(updateOrderCallBack);

    return () => {
      shipperSocketSevice.disconnect();
    };
  }, []);

  // Check token validity
  useEffect(() => {
    const checkToken = async () => {
      if(authState.needAuthen){
        const tokenIsValid = await AppAsyncStorage.isTokenValid();
        setTokenValid(tokenIsValid);
        setLoadingSplash(false);
      }
     
    };
    checkToken();
  }, []);

 

  useEffect(() => {
    console.log('orderUpdate:', orderUpdate);
    if (orderUpdate) {
      showMessage({
        message: 'Đơn hàng mới',
        description: orderUpdate.message,
        type: 'success',
        icon: 'success',
        duration: 5000,
        titleStyle: {fontSize: 14, fontWeight: 'bold'},
        textStyle: {fontSize: 14, color: 'white'},
      });
    }
  }, [orderUpdate]);

  return {
    loadingSplash
    
  };
};
