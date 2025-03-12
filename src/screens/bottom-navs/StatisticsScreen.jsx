import React from 'react';
import {StyleSheet, View} from 'react-native';
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
      <SubmittedSuccessfully />
    </View>
  );
};
export default StatisticsScreen;

const styles = StyleSheet.create({});
