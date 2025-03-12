import {useNavigation} from '@react-navigation/native';
import {Tab, TabView} from '@rneui/themed';
import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {LightStatusBar, StoreAddress} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';

const HomeScreen = () => {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();

  const handleOrderPress = orderId => {
    navigation.navigate('OrderDetailScreen', {orderId});
  };



  return (
    <View style={styles.container}>
      <LightStatusBar />
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
          textAlign: 'center',
          marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
        }}>
        Đơn hàng
      </Text>
      <Tab
        value={index}
        onChange={setIndex}
        scrollable={true}
        variant="secondary"
        indicatorStyle={{backgroundColor: 'transparent'}}>
        {['Đơn Mới', 'Hoàn Tất', 'Giao Thất Bại'].map((title, i) => (
          <Tab.Item
            key={i}
            title={title}
            titleStyle={{
              fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
              color: index === i ? colors.white : colors.black,
              height: 55,
            }}
            containerStyle={{
              backgroundColor: index === i ? colors.green700 : colors.white,
              borderRadius: 10,
              paddingVertical: 4,
              height: 30,
            }}
          />
        ))}
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        {['Đơn Mới', 'Hoàn Tất', 'Giao Thất Bại'].map((status, i) => (
          <TabView.Item key={i} style={styles.tabView}>
            <StoreAddress title="Quận 12">
              <FlatList
                data={status === 'Tất cả' ? orders : filteredOrders(status)}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.orderItem}
                    onPress={() => handleOrderPress(item.orderId)}>
                    <View style={{flex: 2}}>
                      <Text style={styles.orderId}>
                        Mã đơn hàng: #{item.orderId}
                      </Text>
                      <Text>Thời gian: {item.time}</Text>
                    </View>
                    <Text
                      style={[styles.orderStatus, getStatusStyle(item.status)]}>
                      {item.status}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </StoreAddress>
          </TabView.Item>
        ))}
      </TabView>
    </View>
  );
};

const getStatusStyle = status => {
  switch (status) {
    case 'Đơn Mới':
      return {backgroundColor: colors.red200, color: colors.red800};
    case 'Hoàn Tất':
      return {backgroundColor: colors.blue300, color: colors.blue600};
    case 'Thất Bại':
      return {backgroundColor: colors.green200, color: colors.green700};
    default:
      return {backgroundColor: colors.green200, color: colors.gray700};
  }
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabView: {
    width: '100%',
    backgroundColor: colors.gray200,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  orderItem: {
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderColor: colors.gray400,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
  },
  orderStatus: {
    flex: 1,
    borderRadius: 6,
    fontWeight: '500',
    textAlign: 'center',
    height: 25,
    paddingVertical: 4,
  },
});

export default HomeScreen;
