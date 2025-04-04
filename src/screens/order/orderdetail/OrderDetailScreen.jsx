import Geolocation from '@react-native-community/geolocation';
import MapboxGL from '@rnmapbox/maps';
import { Call, Send2 } from 'iconsax-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { getOrderDetail, updateOrderStatus } from '../../../axios';
import { ActionDialog, StatusText, Column, DualTextRow, HorizontalProductItem, LightStatusBar, NormalHeader, NormalLoading, NormalText, PrimaryButton, Row } from '../../../components';
import { DeliveryMethod, GLOBAL_KEYS, OrderStatus, colors } from '../../../constants';
import { useAppContext } from '../../../context/appContext';
import { OrderGraph } from '../../../layouts/graphs';
import { Toaster } from '../../../utils';
import { Linking } from 'react-native';

const GOONG_API_KEY = 'stT3Aahcr8XlLXwHpiLv9fmTtLUQHO94XlrbGe12';
const GOONG_MAPTILES_KEY = 'pBGH3vaDBztjdUs087pfwqKvKDXtcQxRCaJjgFOZ';

MapboxGL.setAccessToken(GOONG_API_KEY);



const OrderDetailScreen = props => {
  const { navigation, route } = props;
  const animationRef = useRef(null);
  const { orderId } = route.params;
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionDialogVisible, setActionDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [approveAction, setApproveAction] = useState(null);
  const { updateOrderMessage, setOrderDualStatuses } = useAppContext();
  const cameraRef = useRef(null);
  const [userLocation, setUserLocation] = useState([null, null]);
  const [customerLocation, setCustomerLocation] = useState([null, null]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const convertedCoordinates = routeCoordinates.map(([lat, lng]) => [lng, lat]);

  console.log(convertedCoordinates);
  // vị trí người dùng 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Geolocation.getCurrentPosition(
        position => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          if (cameraRef.current) {
            cameraRef.current.setCamera({
              centerCoordinate: [longitude, latitude],
              zoomLevel: 14,
              animationDuration: 1000,
            });
          } console.log('Vị trí người dùng', position)
        },
        error => console.log(error),
        { timeout: 5000 },
      );

    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);



  const fetchOrderDetail = async () => {
    try {
      const response = await getOrderDetail(orderId);
      setOrderDetail(response);
      const latitude = response.latitude;
      const longitude = response.longitude;
      setCustomerLocation([longitude, latitude]);
      console.log(`Vị trí giao hàng: Latitude: ${latitude}, Longitude: ${longitude}`);
      //   console.log('>>>>>>response', JSON.stringify(response, null, 2))
    } catch (error) {
      console.error('error', error);
    } finally {
      setLoading(false);
    }
  };


  const onApprove = (message, newStatus, callback) => {
    setActionDialogVisible(true);
    setDialogMessage(message);
    setApproveAction(() => async () => {
      try {
        const oldStatus = orderDetail?.status

        await updateOrderStatus(_id, newStatus);
        await fetchOrderDetail();
        setOrderDualStatuses({ status: newStatus, oldStatus })
        Toaster.show('Cập nhật đơn hàng thành công')
        if (callback) {
          callback()
        }
      } catch (error) {
        console.log("error", error);
        Toaster.show('Cập nhật đơn hàng thất bại')
      } finally {
        setActionDialogVisible(false);
      }
    });
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId, updateOrderMessage]);


  useEffect(() => {
    const loopAnimation = () => {
      animationRef.current?.play(0, 60);
      setTimeout(loopAnimation, 1000);
    };

    loopAnimation();

    return () => clearTimeout();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <LightStatusBar />
        <NormalHeader
          title="Chi tiết đơn hàng"
          onLeftPress={() => navigation.goBack()}
        />
        <NormalLoading visible={true} />
      </View>
    );
  }
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const rad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000;
    return distance;
  };

  const checkDistanceAndApprove = (statusMessage, newStatus, successAction) => {
    if (userLocation[0] && customerLocation[0]) {
      const distance = getDistance(userLocation[0], userLocation[1], customerLocation[0], customerLocation[1]);
      if (distance <= 1000) {
        // Cập nhật trạng thái đơn hàng
        updateOrderStatus(orderId, newStatus)  // Cập nhật trạng thái đơn hàng
          .then(() => {
            setDialogMessage(statusMessage);
            setApproveAction(() => {
              successAction();
            });
            setActionDialogVisible(true);
          })
          .catch((error) => {
            setDialogMessage("Lỗi cập nhật trạng thái đơn hàng");
            setApproveAction(() => null);
            setActionDialogVisible(true);
          });
      } else {
        setDialogMessage('Bạn phải ở gần vị trí khách hàng để hoàn thành giao hàng.');
        setApproveAction(() => null);
        setActionDialogVisible(true);
      }
    }
  };


  const {
    _id, status, shipper, store, owner, deliveryMethod, shippingAddress,
    orderItems, shippingFee, voucher, paymentMethod, fulfillmentDateTime, totalPrice
  } = orderDetail;

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        enableRightIcon={status === OrderStatus.SHIPPING_ORDER.value}
        onRightPress={() => {
          navigation.navigate("MapScreen", {
            userLocation: userLocation,
            customerLocation: customerLocation,
            routeCoordinates: routeCoordinates,
            orderId: orderId,
            status: status,
          });

        }}
        rightIcon='google-maps'
        title="Chi tiết đơn hàng" onLeftPress={() => navigation.goBack()} enableLeftIcon />



      <ScrollView showsVerticalScrollIndicator={false} style={styles.containerContent}>
        <Row
          style={{
            paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
            paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
            marginBottom: GLOBAL_KEYS.GAP_SMALL,
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: colors.white
          }}>
          <Text style={{ fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.black, flex: 1, fontWeight: '500' }}>
            {orderDetail?.deliveryMethod === 'pickup' ? 'Tự đến lấy hàng' : 'Giao hàng tận nơi'}
          </Text>

          <StatusText status={orderDetail?.status} />

        </Row>


        <RecipientInfo deliveryMethod={deliveryMethod} owner={owner} shippingAddress={shippingAddress} detail={orderDetail} />

        <ProductsInfo orderItems={orderItems} />

        <PaymentDetails
          detail={orderDetail}
          _id={_id}
          shippingFee={shippingFee}
          voucher={voucher}
          paymentMethod={paymentMethod}
          fulfillmentDateTime={fulfillmentDateTime}
          orderItems={orderItems}
          totalPrice={totalPrice}
          status={status}
        />



        {status === OrderStatus.READY_FOR_PICKUP.value && (

          <PrimaryButton
            style={{ flex: 1, margin: 16 }}
            onPress={() => onApprove("Bắt đầu giao hàng", OrderStatus.SHIPPING_ORDER.value)}
            title='Bắt đầu giao hàng'
          />
        )}

        {status === OrderStatus.FAILED_DELIVERY.value && (

          <PrimaryButton
            style={{ flex: 1, margin: 16 }}
            onPress={() => onApprove("Giao lại đơn hàng", OrderStatus.SHIPPING_ORDER.value)}
            title='Giao lại đơn hàng'
          />
        )}


        {status === OrderStatus.SHIPPING_ORDER.value && (
          <Row style={{ gap: 16, backgroundColor: colors.white, padding: 16 }}>
            <PrimaryButton
              titleStyle={{ color: colors.red900 }}
              style={{ flex: 1, backgroundColor: colors.white, borderColor: colors.red900, borderWidth: 1 }}
              onPress={() => checkDistanceAndApprove(
                'Giao hàng thất bại',
                OrderStatus.FAILED_DELIVERY.value,
                () => navigation.goBack()
              )}
              title='Hủy đơn hàng'
            />
            <PrimaryButton
              style={{ flex: 1 }}
              onPress={() => checkDistanceAndApprove(
                'Đơn hàng hoàn thành',
                OrderStatus.COMPLETED.value,
                () => navigation.navigate(OrderGraph.OrderDoneScreen)
              )}
              title='Hoàn thành đơn hàng'
              disabled={!userLocation || !customerLocation}
            />

          </Row>
        )}


      </ScrollView>

      <ActionDialog
        visible={actionDialogVisible}
        title="Xác nhận"
        content={dialogMessage}
        cancelText="Đóng"
        approveText="Đồng ý"
        onCancel={() => setActionDialogVisible(false)}
        onApprove={approveAction}
      />
    </View>
  );
};





const ProductsInfo = ({ orderItems }) => {
  return (
    <View style={[styles.areaContainer, { borderBottomWidth: 0 }]}>
      <View style={{ marginHorizontal: 16 }}>
        <Title title={'Danh sách sản phẩm'} icon="clipboard-list" />
      </View>

      <FlatList
        data={orderItems}
        keyExtractor={item => item.product._id}
        renderItem={({ item }) => {
          const formattedItem = {

            productName: item.product.name,
            image: item.product.image,
            variantName: item.product.size,
            price: item.price,
            quantity: item.quantity,
            isVariantDefault: false,
            toppingItems: Array.isArray(item.toppingItems)
              ? item.toppingItems
              : [],
          };

          return (
            <HorizontalProductItem
              item={formattedItem}
              enableAction={false}
            />
          );
        }}
        contentContainerStyle={styles.flatListContentContainer}
        scrollEnabled={false}
      />
    </View>
  );
};



const RecipientInfo = ({ deliveryMethod, owner, shippingAddress, detail }) => {
  const handleCall = () => {
    if (!detail?.consigneePhone) return;

    const phoneNumber = `tel:${detail.consigneePhone}`;

    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          console.error("Thiết bị không hỗ trợ gọi điện!");
        } else {
          Linking.openURL(phoneNumber);
        }
      })
      .catch((err) => console.error("Lỗi khi kiểm tra URL:", err));
  };


  return (
    <Column style={[styles.areaContainer, { paddingHorizontal: 16 }]}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Title title="Người nhận" icon="map-marker" />

        <Row style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCall}>
            <Call size="22" color={colors.green700} variant="Bold" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Send2 size="22" color={colors.green700} variant="Bold" />
          </TouchableOpacity>
        </Row>
      </Row>

      <NormalText
        text={[detail.consigneeName, '|', detail.consigneePhone].join(' ')}
        style={{ color: colors.black }}
      />

      {deliveryMethod === DeliveryMethod.DELIVERY.value && (
        <Text style={styles.normalText}>
          {detail.shippingAddress}
        </Text>
      )}
    </Column>
  );
};

const Title = ({
  title,
  icon,
  titleStyle,
  iconColor = colors.primary,
  iconSize = GLOBAL_KEYS.ICON_SIZE_DEFAULT,
}) => {
  return (
    <View style={styles.titleContainer}>
      {icon && <Icon source={icon} color={iconColor} size={iconSize} />}

      <Text style={[styles.greenText, titleStyle]}>{title}</Text>
    </View>
  );
};

const PaymentDetails = ({
  detail,
  _id,
  shippingFee,
  voucher,
  paymentMethod,
  orderItems,
  totalPrice,
  status,
  createdAt,
}) => {
  // Tính tổng tiền sản phẩm (chưa bao gồm phí giao hàng và giảm giá)
  const subTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  console.log('detail', JSON.stringify(detail, null, 3))
  // Số tiền giảm giá từ voucher (nếu có)
  const discount = voucher
    ? voucher.discountType === 'percentage'
      ? (subTotal * voucher.discountValue) / 100
      : voucher.discountValue
    : 0;

 
  // Xác định trạng thái thanh toán
  const getPaymentStatus = () => {
    if (status === 'completed') {
      return { text: 'Đã thanh toán', color: colors.primary };
    }
    if (paymentMethod === 'cod') {
      return { text: 'Chưa thanh toán', color: colors.orange700 };
    }
    if (status === 'awaitingPayment') {
      return { text: 'Chờ thanh toán', color: colors.pink500 };
    }
    if (status === 'cancelled') {
      return { text: 'Chưa thanh toán', color: colors.orange700 };
    }
    return { text: 'Đã thanh toán', color: colors.primary };
  };

  const paymentStatus = getPaymentStatus();

  return (
    <View style={{ marginBottom: 8, flex: 1, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.white }}>
      <DualTextRow
        leftText="Chi tiết thanh toán"
        leftTextStyle={{ color: colors.primary, fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}
      />
      <OrderId _id={_id} />

      <Row
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{ fontSize: 14, color: colors.black, marginRight: 8 }}>
          Trạng thái đơn hàng
        </Text>
        <StatusText status={status} />
      </Row>

      <DualTextRow
        leftText={`Tạm tính (${orderItems.length} sản phẩm)`}
        rightText={`${subTotal.toLocaleString()}đ`}
      />

      <DualTextRow
        leftText="Phí giao hàng"
        rightText={`${shippingFee.toLocaleString()}đ`}
      />

      <DualTextRow
        leftText="Giảm giá"
        rightText={`-${(discount || 0).toLocaleString('vi-VN')}đ`}
        rightTextStyle={{ color: colors.primary }}
      />

      <DualTextRow
        leftText="Trạng thái thanh toán"
        rightText={paymentStatus.text}
        rightTextStyle={{ color: paymentStatus.color }}
      />

      {detail?.createdAt && (
        <DualTextRow
          leftText="Thời gian chờ xác nhận"
          rightText={new Date(detail?.createdAt).toLocaleString('vi-VN')}
        />
      )}


      {detail?.pendingConfirmationAt && (
        <DualTextRow
          leftText="Thời gian chờ xác nhận"
          rightText={new Date(detail?.pendingConfirmationAt).toLocaleString('vi-VN')}
        />
      )}


      {detail?.readyForPickupAt && (
        <DualTextRow
          leftText="Thời gian sẵn sàng lấy hàng"
          rightText={new Date(detail?.readyForPickupAt).toLocaleString('vi-VN')}
        />
      )}


      {detail?.shippingOrderAt && (
        <DualTextRow
          leftText="Thời gian giao hàng"
          rightText={new Date(detail?.shippingOrderAt).toLocaleString('vi-VN')}
        />
      )}


      {detail?.completedAt && (
        <DualTextRow
          leftText="Thời gian hoàn thành"
          rightText={new Date(detail?.completedAt).toLocaleString('vi-VN')}
        />
      )}


      {detail?.cancelledAt && (
        <DualTextRow
          leftText="Thời gian hủy đơn"
          rightText={new Date(detail?.cancelledAt).toLocaleString('vi-VN')}
        />
      )}

      <Row
        style={{
          alignItems: 'center',
          marginVertical: 6,
          justifyContent: 'space-between',
        }}>
        <Text style={{ fontSize: 14, color: colors.black, marginRight: 8 }}>
          Phương thức thanh toán:
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>

          <Text style={{ fontSize: 14, color: colors.black, marginLeft: 8 }}>
            {paymentMethod === 'online' ? 'Thanh toán online' : 'Tiền mặt'}
          </Text>
        </View>
      </Row>

      <DualTextRow
        leftText="Tổng tiền"
        rightText={`${totalPrice.toLocaleString('vi-VN')}đ`}
        rightTextStyle={{ color: colors.primary, fontWeight: '700', fontSize: 18 }}
        leftTextStyle={{ color: colors.black, fontWeight: '500' }}
      />
    </View>

  );
};


const OrderId = ({ _id }) => {
  return (
    <View style={[styles.row, { marginBottom: 6 }]}>
      <Text style={styles.normalText}>Mã đơn hàng</Text>
      <Pressable style={styles.row} onPress={() => { }}>
        <Text style={[styles.normalText, { fontWeight: 'bold', marginRight: 8 }]}>
          {_id}
        </Text>
        <Icon source="content-copy" color={colors.teal900} size={18} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.fbBg,
    flex: 1,
    gap: 5
  },
  containerContent: {
    backgroundColor: colors.fbBg,
    flex: 1,
    gap: 12,
  },
  lottieContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieView: {
    width: 200,
    height: 200,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  normalText: {
    textAlign: 'justify',
    lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    marginRight: 4,
  },

  flatListContentContainer: {
    gap: 5,
    backgroundColor: colors.fbBg
  },
  greenText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.primary,
    fontWeight: '600',
  },
  titleContainer: {
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  areaContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    marginBottom: 5
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gray200,
    borderWidth: 2,
    margin: 16,
  },
  userMarker: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: 'white',
  },
  status: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.green500, fontWeight: '500' },
});

export default OrderDetailScreen