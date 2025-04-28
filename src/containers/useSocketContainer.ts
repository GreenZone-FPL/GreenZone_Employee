import {useEffect} from 'react';
import {showMessage} from 'react-native-flash-message';
import {useAppContext} from '../context/appContext';
import shipperSocketSevice from '../service/shipperSocketSevice';

export const useSocketContainer = () => {
  const {orderUpdate, setOrderUpdate} = useAppContext();

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
};
