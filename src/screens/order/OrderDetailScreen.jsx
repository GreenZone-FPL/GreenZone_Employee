import Geolocation from '@react-native-community/geolocation';
import MapboxGL from '@rnmapbox/maps';
import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { getOrderDetail, updateOrderStatus } from '../../axios';
import {
  ActionDialog,
  LightStatusBar,
  NormalHeader,
  NormalLoading,
  PrimaryButton,
  Row,
  StatusText
} from '../../components';
import { GLOBAL_KEYS, OrderStatus, colors } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { OrderGraph } from '../../layouts/graphs';
import { Toaster } from '../../utils';

import { CancelDialog, PaymentDetails, ProductsInfo, RecipientInfo, TimelineStatus } from './order-detail-components';

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
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
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
          }
          // console.log('Vị trí người dùng', position);
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
      // console.log(
      //   `Vị trí giao hàng: Latitude: ${latitude}, Longitude: ${longitude}`,
      // );
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
        const oldStatus = orderDetail?.status;
        setActionDialogVisible(false);
        await updateOrderStatus(_id, newStatus);

        await fetchOrderDetail();
        setOrderDualStatuses({ status: newStatus, oldStatus });
        Toaster.show('Cập nhật đơn hàng thành công');
        if (callback) {
          callback();
        }
      } catch (error) {
        console.log('error', error);
        Toaster.show('Cập nhật đơn hàng thất bại');
      } finally {
       
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
    const rad = x => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000;
    return distance;
  };

  const checkDistanceAndApprove = (statusMessage, newStatus, successAction) => {
    if (userLocation[0] && customerLocation[0]) {
      const distance = getDistance(
        userLocation[0],
        userLocation[1],
        customerLocation[0],
        customerLocation[1],
      );

      if (distance <= 10000000) {
      // if (distance > 1) {
        if (newStatus === OrderStatus.FAILED_DELIVERY.value || newStatus === OrderStatus.CANCELLED.value) {
          setCancelDialogVisible(true)
        } else {
          // Cập nhật trạng thái đơn hàng
          updateOrderStatus(orderId, newStatus) // Cập nhật trạng thái đơn hàng
            .then(() => {
              setDialogMessage(statusMessage);
              setApproveAction(() => {
                successAction();
              });
              setActionDialogVisible(true);
            })
            .catch(error => {
              setDialogMessage('Lỗi cập nhật trạng thái đơn hàng');
              setApproveAction(() => null);
              setActionDialogVisible(true);
            });
        }

      } else {
        setDialogMessage(
          'Bạn phải ở gần vị trí khách hàng để hoàn thành giao hàng.',
        );
        setApproveAction(() => null);
        setActionDialogVisible(true);
      }
    }
  };

  const {
    _id,
    status,
    shipper,
    orderItems,
  } = orderDetail;


  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        enableRightIcon={status === OrderStatus.SHIPPING_ORDER.value}
        onRightPress={() => {
          navigation.navigate('MapScreen', {
            userLocation: userLocation,
            customerLocation: customerLocation,
            routeCoordinates: routeCoordinates,
            orderId: orderId,
            status: status,
          });
        }}
        rightIcon="google-maps"
        title="Chi tiết đơn hàng"
        onLeftPress={() => navigation.goBack()}
        enableLeftIcon
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.containerContent}>
        <Row
          style={{
            paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
            paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
            marginBottom: GLOBAL_KEYS.GAP_SMALL,
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: colors.white,
          }}>
          <Text
            style={{
              fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
              color: colors.black,
              flex: 1,
              fontWeight: '500',
            }}>
            {orderDetail?.deliveryMethod === 'pickup'
              ? 'Tự đến lấy hàng'
              : 'Giao hàng tận nơi'}
          </Text>

          <StatusText status={orderDetail?.status} />
        </Row>
        <TimelineStatus details={orderDetail}/>

        <RecipientInfo detail={orderDetail} />

        <ProductsInfo orderItems={orderItems} />


        <PaymentDetails detail={orderDetail} />

        {status === OrderStatus.READY_FOR_PICKUP.value && (
          <PrimaryButton
            style={{ flex: 1, margin: 16 }}
            onPress={() =>
              onApprove('Bắt đầu giao hàng', OrderStatus.SHIPPING_ORDER.value)
            }
            title="Bắt đầu giao hàng"
            disabled={loading}
          />
        )}

        {/* {status === OrderStatus.FAILED_DELIVERY.value && (
          <PrimaryButton
            style={{ flex: 1, margin: 16 }}
            onPress={() =>
              onApprove('Bắt đầu giao hàng', OrderStatus.SHIPPING_ORDER.value)
            }
            title="Bắt đầu giao hàng"
          />
        )} */}

        {status === OrderStatus.SHIPPING_ORDER.value && (
          <Row style={{ gap: 16, backgroundColor: colors.white, padding: 16 }}>
            <PrimaryButton
              titleStyle={{ color: colors.red900 }}
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: colors.white,
                borderColor: colors.red900,
                borderWidth: 1,
              }}
              onPress={() =>
                checkDistanceAndApprove(
                  'Giao hàng thất bại',
                  OrderStatus.FAILED_DELIVERY.value,
                  () => navigation.goBack(),
                )
              }
              title="Hủy đơn hàng"
            />
            <PrimaryButton
              style={{ flex: 1 }}
              onPress={() =>
                checkDistanceAndApprove(
                  'Đơn hàng hoàn thành',
                  OrderStatus.COMPLETED.value,
                  () => navigation.navigate(OrderGraph.OrderDoneScreen),
                )
              }
              title="Hoàn thành"
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

      <CancelDialog
        visible={cancelDialogVisible}
        onHide={() => setCancelDialogVisible(false)}
        orderId={_id}
        shipperId={shipper._id}
        callBack={async () => {
          await fetchOrderDetail()
          setOrderDualStatuses({ status: OrderStatus.FAILED_DELIVERY.value, status });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.fbBg,
    flex: 1,
    gap: 5,
  },
  containerContent: {
    backgroundColor: colors.fbBg,
    flex: 1,
    gap: 12,
  },
});

export default OrderDetailScreen;
