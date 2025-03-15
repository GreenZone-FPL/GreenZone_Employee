import {useNavigation} from '@react-navigation/native';
import {Tab, TabView} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {LightStatusBar, StoreAddress} from '../../components';
import {colors, GLOBAL_KEYS, OrderStatus} from '../../constants';
import { getOrders } from '../../axios';
import { AppAsyncStorage } from '../../utils';


const HomeScreen = () => {
  const [index, setIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
 const fetchOrders = async () => {
   setLoading(true);
   try {
     const assignedShipperId = await AppAsyncStorage.readData('phoneNumber');
     console.log('Shipper phoneNumber:', assignedShipperId);

     if (!assignedShipperId) {
       console.error('Không tìm thấy shipperId');
       setLoading(false);
       return;
     }

     const statusList = [
       'readyForPickup',
       'shippingOrder',
       'completed',
       'failedDelivery',
     ];
     const response = await getOrders(statusList[index]);

     console.log('API Response:', JSON.stringify(response,null,2)); // Kiểm tra dữ liệu API

     if (response?.success) {
       const filteredOrders = response.data.filter(
         order =>
           String(order.shipper.phoneNumber) === String(assignedShipperId),
       );
       console.log('Filtered Orders:', JSON.stringify(filteredOrders,null,2)); // Kiểm tra danh sách đã lọc
       setOrders(filteredOrders);
     }
   } catch (error) {
     console.error('Lỗi khi lấy đơn hàng:', error);
   } finally {
     setLoading(false);
   }
 };


    fetchOrders();
  }, [index]); // Gọi lại khi index (trạng thái đơn hàng) thay đổi

  const handleOrderPress = orderId => {
    navigation.navigate('OrderDetailScreen', {orderId});
  };
  const getStatusLabel = value => {
    const statusEntry = Object.values(OrderStatus).find(
      status => status.value === value,
    );
    return statusEntry ? statusEntry.label : 'Không xác định';
  };

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <Text style={styles.headerText}>Đơn hàng</Text>
      <Tab value={index} onChange={setIndex} scrollable variant="secondary">
        {['Đơn Mới', 'Đang Giao', 'Hoàn Tất', 'Giao Thất Bại'].map(
          (title, i) => (
            <Tab.Item
              key={i}
              title={title}
              titleStyle={styles.tabTitle(index === i)}
              containerStyle={styles.tabContainer(index === i)}
            />
          ),
        )}
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        {[
          'readyForPickup',
          'shippingOrder',
          'completed',
          'failedDelivery',
        ].map((status, i) => (
          <TabView.Item key={i} style={styles.tabView}>
            <StoreAddress title="GREEN ZONE">
              {loading ? (
                <ActivityIndicator size="large" color={colors.green700} />
              ) : (
                <FlatList
                  data={orders.filter(order => order.status === status)}
                  keyExtractor={item => item._id}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.orderItem}
                      onPress={() => handleOrderPress(item._id)}>
                      <View style={{flex: 2}}>
                        <Text style={styles.orderId}>
                          Mã đơn hàng: #{item._id}
                        </Text>
                        <Text>
                          Thời gian:{' '}
                          {new Date(item.fulfillmentDateTime).toLocaleString()}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.orderStatus,
                          getStatusStyle(item.status),
                        ]}>
                        {getStatusLabel(item.status)}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </StoreAddress>
          </TabView.Item>
        ))}
      </TabView>
    </View>
  );
};


const getStatusStyle = status => {
  switch (status) {
    case 'readyForPickup':
      return {backgroundColor: colors.red200, color: colors.red800};
    case 'shippingOrder':
      return {backgroundColor: colors.red200, color: colors.red800};
    case 'completed':
      return {backgroundColor: colors.blue300, color: colors.blue600};
    case 'failedDelivery':
      return {backgroundColor: colors.green200, color: colors.green700};
    default:
      return {backgroundColor: colors.gray200, color: colors.gray700};
  }
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  headerText: {
    fontWeight: 'bold',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    textAlign: 'center',
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  tabView: {
    width: '100%',
    backgroundColor: colors.gray200,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  orderItem: {
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomWidth: 1,
    borderColor: colors.gray400,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE, fontWeight: 'bold'},
  orderStatus: {
    flex: 1,
    borderRadius: 6,
    fontWeight: '500',
    textAlign: 'center',
    height: 25,
    paddingVertical: 4,
  },
  tabTitle: active => ({
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: active ? colors.white : colors.black,
    height: 55,
  }),
  tabContainer: active => ({
    backgroundColor: active ? colors.green700 : colors.white,
    borderRadius: 10,
    paddingVertical: 4,
    height: 30,
  }),
});

export default HomeScreen;
