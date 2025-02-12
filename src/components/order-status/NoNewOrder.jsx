import {View, Text, Image, Dimensions} from 'react-native';
import React from 'react';
import {GLOBAL_KEYS} from '../../constants';
const {width} = Dimensions.get('window');

const NoNewOrder = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: (width / 5) * 4,
        gap: GLOBAL_KEYS.GAP_DEFAULT,
      }}>
      <Image
        style={{
          resizeMode: 'cover',
        }}
        source={require('../../assets/images/order/background_order.png')}
      />
      <Text
        style={{
          fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER + 4,
          fontWeight: '400',
        }}>
        No New Orders
      </Text>
    </View>
  );
};

export default NoNewOrder;
