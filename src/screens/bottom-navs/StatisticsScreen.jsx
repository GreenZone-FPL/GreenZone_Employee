import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NormalHeader} from '../../components';
import {GLOBAL_KEYS} from '../../constants';
import NoNewOrder from '../../components/order-status/NoNewOrder';
import SubmittedSuccessfully from '../../components/order-status/SubmittedSuccessfully';

const StatisticsScreen = () => {
  return (
    <View style={{flex: 1}}>
      <SubmittedSuccessfully></SubmittedSuccessfully>
    </View>
  );
};

const Header = () => {
  return (
    <View style={{flex: 1}}>
      {/* <Text
        style={{
          fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Thống kê
      </Text> */}
      {/* <NoNewOrder /> */}
      <SubmittedSuccessfully />
    </View>
  );
};
export default StatisticsScreen;

const styles = StyleSheet.create({});
