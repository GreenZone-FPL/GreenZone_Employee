import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NormalHeader} from '../../components';
import {GLOBAL_KEYS} from '../../constants';

const StatisticsScreen = () => {
  return (
    <View>
      <Header />
    </View>
  );
};

const Header = () => {
  return (
    <View>
      <Text
        style={{
          fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Thống kê
      </Text>
    </View>
  );
};
export default StatisticsScreen;

const styles = StyleSheet.create({});
