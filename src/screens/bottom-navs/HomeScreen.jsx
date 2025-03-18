import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback  } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getOrdersByStatus } from '../../axios';
import { Column, CustomTabView, LightStatusBar, NormalText, Row, StoreAddress, TitleText } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { AppAsyncStorage, TextFormatter } from '../../utils';
import { OrderGraph } from '../../layouts/graphs';
import { useAppContext } from '../../context/appContext';

const statuses = ['readyForPickup', 'shippingOrder', 'completed', 'failedDelivery'];
const tabTitles = ['Đơn Mới', 'Đang Giao', 'Hoàn Thành', 'Giao Thất Bại'];

const HomeScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { orderDualStatuses } = useAppContext();
console.log('orderDualStatuses', orderDualStatuses)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const phoneNumber = await AppAsyncStorage.readData('phoneNumber');
      const response = await getOrdersByStatus(statuses[index]);

      const filteredOrders = response.filter(o => o.shipper.phoneNumber === phoneNumber);
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error', error);
    } finally {
      setLoading(false);
    }
  };


  // Luôn tải danh sách đơn hàng khi chuyển tab
  useEffect(() => {
    fetchOrders();
  }, [index]);


  // Tải lại danh sách nếu trạng thái đơn hàng thay đổi trùng với tab hiện tại
  useFocusEffect(
    useCallback(() => {
      if (!orderDualStatuses) return;

      const { oldStatus, status } = orderDualStatuses;

      console.log(`📌 Trạng thái đơn hàng thay đổi: ${oldStatus} ➝ ${status}`);

      if (statuses[index] === status || statuses[index] === oldStatus ) {
        console.log(`🔄 Reload danh sách đơn hàng cho tab: ${statuses[index]}`);
        fetchOrders();
      }
    }, [orderDualStatuses])
  );







  return (
    <View style={styles.container}>
      <LightStatusBar />
      <Text style={styles.headerText}>Đơn hàng</Text>

      <CustomTabView
        tabIndex={index}
        setTabIndex={setIndex}
        tabBarConfig={{
          titles: tabTitles,
          titleActiveColor: colors.primary,
          titleInActiveColor: colors.gray700,
        }}
      >
        {statuses.map((status, i) => (
          <Column key={i} style={styles.tabView}>
            <StoreAddress title="GREEN ZONE">
              {loading ? (
                <ActivityIndicator size="large" color={colors.green700} />
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={orders.filter(order => order.status === status)}
                  keyExtractor={item => item._id}
                  contentContainerStyle={{ gap: 5, backgroundColor: colors.fbBg }}
                  renderItem={({ item }) =>
                    <OrderItem
                      item={item}
                      handleOrderPress={() => navigation.navigate(OrderGraph.OrderDetailScreen, { orderId: item._id })}
                    />
                  }
                />

              )}
            </StoreAddress>
          </Column>
        ))}
      </CustomTabView>
    </View>
  );
};


const OrderItem = ({ item, handleOrderPress }) => {
  const { _id, totalPrice, shippingAddress, fulfillmentDateTime } = item;
  const { consigneeName, consigneePhone, specificAddress, ward, district, province } = shippingAddress;
  const formattedAddress = `${specificAddress}, ${ward}, ${district}, ${province}`;

  const getOrderItemsText = () => {
    const items = item?.orderItems || [];
    if (items.length > 2) {
      return `${items[0].product.name} - ${items[1].product.name} và ${items.length - 2
        } sản phẩm khác`;
    }
    return (
      items.map(item => item.product.name).join(' - ') || 'Chưa có sản phẩm'
    );
  };


  return (
    <TouchableOpacity style={styles.orderItem} onPress={handleOrderPress}>
      <Column style={{ flex: 2 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <NormalText text={`#${_id}`} style={styles.orderIdText} />
          <TitleText text={TextFormatter.formatCurrency(totalPrice)} style={styles.priceText} />
        </Row>

        <Text numberOfLines={2} style={styles.orderName}>
          {getOrderItemsText()}
        </Text>



        <NormalText text={`${consigneeName} || ${consigneePhone}`} style={styles.recipientText} />
        <NormalText text={formattedAddress} />
        <NormalText text={new Date(fulfillmentDateTime).toLocaleString()} style={styles.dateText} />
      </Column>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  headerText: {
    fontWeight: 'bold',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    textAlign: 'center',
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  tabView: {
    width: '100%',
    backgroundColor: colors.fbBg,
    gap: 8
  },
  orderItem: {
    backgroundColor: colors.white,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipientText: { color: colors.black, fontWeight: '500' },
  orderIdText: { color: colors.pink500 },
  priceText: { color: colors.primary },
  dateText: { color: colors.gray700 },
  orderName: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500', color: colors.primary },
});

export default HomeScreen
