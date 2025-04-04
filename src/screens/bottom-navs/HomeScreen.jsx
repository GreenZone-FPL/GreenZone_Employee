import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getOrdersByStatus, getMerchant } from '../../axios';
import { Column, CustomTabView, LightStatusBar, NormalLoading, NormalText, Row, StoreAddress, TitleText } from '../../components';
import { colors, GLOBAL_KEYS, OrderStatus } from '../../constants';
import { AppAsyncStorage, TextFormatter } from '../../utils';
import { OrderGraph } from '../../layouts/graphs';
import { useAppContext } from '../../context/appContext';

const statuses = ['readyForPickup', 'shippingOrder', 'completed', 'failedDelivery'];
const tabTitles = ['Đơn mới', 'Đang giao', 'Hoàn thành', 'Giao thất bại'];

const HomeScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);

  const { orderDualStatuses } = useAppContext();


  const fetchOrders = async () => {
    setLoading(true);
    try {
      const phoneNumber = await AppAsyncStorage.readData('phoneNumber');
      console.log('phoneNumber', phoneNumber)
      const response = await getOrdersByStatus(statuses[index]);
      const filteredOrders = response.filter(o => o.shipper.phoneNumber === phoneNumber && o.deliveryMethod === 'delivery');
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error', error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu id cửa hàng
  useEffect(() => {
    const loadMerchant = async () => {
      try {
        const storeId = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.storeId);
        if (storeId) {
          const response = await getMerchant(storeId);
          setMerchant(response);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadMerchant();
  }, []);


  // Luôn tải danh sách đơn hàng khi chuyển tab
  useEffect(() => {
    fetchOrders();
  }, [index, orderDualStatuses]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchOrders();
    });
  
    return unsubscribe;
  }, [index]);

  return (
    <View style={styles.container}>
      <LightStatusBar />

      {
        merchant &&
        <Column style={{ padding: 16, backgroundColor: colors.white }}>
          <Text style={styles.headerText}>{merchant?.name}</Text>
          <Text
            style={
              styles.titleText
            }>{`${merchant.specificAddress}, ${merchant.ward}, ${merchant.district}, ${merchant.province}`}
          </Text>
        </Column>

      }


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
            <>
              {loading ? (
                <NormalLoading visible={loading} />
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
            </>
          </Column>
        ))}
      </CustomTabView>
    </View>
  );
};


const OrderItem = ({ item, handleOrderPress }) => {
  const { _id, totalPrice, shippingAddress, createdAt } = item;
  const {
    consigneeName = item.consigneeName,
    consigneePhone = item.consigneePhone,
    specificAddress = item.shippingAddress,
  } = shippingAddress;
  const formattedAddress = `${specificAddress}`;

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
        <NormalText text={`ID: #...${_id.slice(-8)}`} style={styles.orderIdText} />
          <TitleText text={TextFormatter.formatCurrency(totalPrice)} style={styles.priceText} />
        </Row>

        <Text numberOfLines={2} style={styles.orderName}>
          {getOrderItemsText()}
        </Text>


        <NormalText text={`${consigneeName} || ${consigneePhone}`} style={styles.recipientText} />
        <NormalText text={formattedAddress} />
        <NormalText text={new Date(createdAt).toLocaleString()} style={styles.dateText} />
      </Column>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fbBg, gap: 8 },
  headerText: {
    fontWeight: 'bold',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white
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
  orderIdText: { color: colors.pink500, fontWeight: '500' },
  priceText: { color: colors.primary },
  dateText: { color: colors.gray700 },
  orderName: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500', color: colors.primary },
});

export default HomeScreen
