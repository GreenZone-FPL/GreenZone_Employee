import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getMerchant, getOrdersByStatus, getProfile } from '../../axios';
import {
  Column,
  CustomTabView,
  EmptyView,
  LightStatusBar,
  NormalLoading,
  NormalText,
  Row,
  TitleText,
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { OrderGraph } from '../../layouts/graphs';
import { AppAsyncStorage, TextFormatter } from '../../utils';
import FastImage from 'react-native-fast-image';
import { onUserLoginZego } from '../../zego/common';
import { Icon } from 'react-native-paper';
import { useAppContainer, useSocketContainer } from '../../containers';

const statuses = [
  'readyForPickup',
  'shippingOrder',
  'completed',
  'cancelled',
];
const tabTitles = ['Đơn mới', 'Đang giao', 'Hoàn thành', 'Đơn hủy'];
const { width } = Dimensions.get('window');
const OrderHistoryScreen = ({ navigation }) => {
  const [index, setIndex] = useState(1);
  const [orders, setOrders] = useState([]);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const { orderUpdate, authState } = useAppContext();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const reponse = await getProfile();

      setProfile(reponse);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  useSocketContainer()

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const phoneNumber = await AppAsyncStorage.readData('phoneNumber');
      // console.log('phoneNumber', phoneNumber)
      const response = await getOrdersByStatus(statuses[index]);
      const filteredOrders = response.filter(
        o =>
          o.shipper.phoneNumber === phoneNumber &&
          o.deliveryMethod === 'delivery',
      );
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
        const storeId = await AppAsyncStorage.readData(
          AppAsyncStorage.STORAGE_KEYS.storeId,
        );
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
  }, [index, orderUpdate]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchOrders();
    });

    return unsubscribe;
  }, [index]);

  const initZego = async () => {
    const lastName = await AppAsyncStorage.readData(
      AppAsyncStorage.STORAGE_KEYS.lastName,
    );
    const phoneNumber = await AppAsyncStorage.readData(
      AppAsyncStorage.STORAGE_KEYS.phoneNumber,
    );

    if (phoneNumber && lastName) {
      await onUserLoginZego(phoneNumber, lastName, navigation);
    }
  };

  useEffect(() => {
    if (authState.lastName) {
      initZego();
    } else {
      console.log('Khong the init Zego');
    }
  }, [authState.lastName]);

  return (
    <View style={styles.container}>
      <LightStatusBar />

      {merchant && (
        <Column style={{ padding: 16, backgroundColor: colors.white }}>
          <Row>
            <View style={styles.avatar}>
              <Image
                style={styles.avatar}
                source={{ uri: merchant.images[0] || '' }}
              />
            </View>
            <View>
              <Text style={styles.headerText}>{merchant?.name}</Text>
              <Row>
                <Icon
                  source="account-circle"
                  color={colors.primary}
                  size={24}
                />

                <Text
                  style={{
                    color: '#000',
                  }}>{`${profile?.firstName} ${profile?.lastName}`}</Text>
              </Row>
            </View>
          </Row>

          <Text style={styles.titleText}>{`${merchant.address}`}</Text>
        </Column>
      )}

      <CustomTabView
        tabIndex={index}
        setTabIndex={setIndex}

        tabBarConfig={{
          titles: tabTitles,
          titleActiveColor: colors.primary,
          titleInActiveColor: colors.gray700,
          scrollable: true,
          containerStyle: { backgroundColor: colors.white }
        }}>
        {statuses.map((status, i) => (
          <Column key={i} style={styles.tabView}>
            {
              loading ?
                <View style={{ flex: 1, minHeight: 300 }}>
                  <NormalLoading visible={loading} />

                </View>
                :

                orders.filter(order => order.status === status).length > 0 ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={orders.filter(order => order.status === status)}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                      <OrderItem
                        item={item}
                        handleOrderPress={() =>
                          navigation.navigate(OrderGraph.OrderDetailScreen, {
                            orderId: item._id,
                          })
                        }
                      />
                    )}
                  />
                ) : (
                  <EmptyView message="Danh sách này đang trống" />
                )}
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
  const [loading, setLoading] = useState(false);
  const items = item?.orderItems || [];
  const getOrderItemsText = () => {
    // const items = item?.orderItems || [];
    if (items.length > 2) {
      return `${items[0].product.name} - ${items[1].product.name} và ${items.length - 2
        } sản phẩm khác`;
    }
    return (
      items.map(item => item.product.name).join(' - ') || 'Chưa có sản phẩm'
    );
  };

  return (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={handleOrderPress}
      disabled={loading}>
      <Column style={{ flex: 2 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <NormalText
            text={`#...${_id.slice(-8)}`}
            style={styles.orderIdText}
          />
          <TitleText
            text={TextFormatter.formatCurrency(totalPrice)}
            style={styles.priceText}
          />
        </Row>

        <Row>
          <FastImage
            source={{ uri: items[0].product.image }}
            style={{ width: 38, height: 38, borderRadius: 20 }}
          />
          <Text numberOfLines={2} style={styles.orderName}>
            {getOrderItemsText()}
          </Text>
        </Row>

        <NormalText
          text={`${consigneeName} - ${consigneePhone}`}
          style={styles.recipientText}
        />
        <NormalText text={formattedAddress} />
        <NormalText
          text={new Date(createdAt).toLocaleString()}
          style={styles.dateText}
        />
      </Column>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fbBg, gap: 8 },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: colors.black,
  },
  tabView: {
    width: '100%',
    backgroundColor: colors.fbBg,
    gap: 8,
  },
  avatar: {
    backgroundColor: colors.white,
    width: width / 4,
    height: width / 4,
    borderRadius: width / 6,
    alignSelf: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    resizeMode: 'cover',
    borderRadius: 80,
  },

  orderItem: {
    backgroundColor: colors.white,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    color: colors.black,
  },

  recipientText: { color: colors.black, fontWeight: '500' },
  orderIdText: { color: colors.pink500, fontWeight: '500' },
  priceText: { color: colors.primary },
  dateText: { color: colors.gray700 },
  orderName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default OrderHistoryScreen;
