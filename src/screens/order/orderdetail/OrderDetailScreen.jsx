import { Call, Send2 } from 'iconsax-react-native';
import React, { useEffect, useState, useRef } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { getOrderDetail, updateOrderStatus } from '../../../axios';
import { ActionDialog, Column, DualTextRow, HorizontalProductItem, LightStatusBar, NormalHeader, NormalLoading, NormalText, PrimaryButton, Row } from '../../../components';
import { DeliveryMethod, GLOBAL_KEYS, OrderStatus, colors } from '../../../constants';
import { useAppContext } from '../../../context/appContext';
import LottieView from 'lottie-react-native';
import { OrderGraph, ShoppingGraph } from '../../../layouts/graphs';
import { Toaster } from '../../../utils';
import Geolocation from '@react-native-community/geolocation';
import MapboxGL from '@rnmapbox/maps';
import polyline from 'polyline';
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

  // Lấy tuyến đường từ API Goong.io
  const fetchRoute = async () => {
    if (userLocation[0] === null || customerLocation[0] === null) return;

    // Tạo URL để lấy tuyến đường
    const url = `https://rsapi.goong.io/Direction?origin=${userLocation[1]},${userLocation[0]}&destination=${customerLocation[1]},${customerLocation[0]}&vehicle=car&api_key=${GOONG_API_KEY}`;

    try {
      // Gửi yêu cầu đến API Goong
      const response = await fetch(url);
      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));

      // Kiểm tra dữ liệu trả về có hợp lệ không
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].overview_polyline.points;
        if (route) {
          // Giải mã polyline và cập nhật tuyến đường
          const decodedRoute = polyline.decode(route);
          if (decodedRoute.length > 0) {
            console.log('Tuyến đường đã giải mã:', JSON.stringify(decodedRoute, null, 2));
            setRouteCoordinates(decodedRoute);
          } else {
            console.error('Dữ liệu tuyến đường sau khi giải mã rỗng.');
          }
        } else {
          console.error("Không có trường 'overview_polyline' trong tuyến đường.");
        }
      } else {
        console.error("Không có tuyến đường hợp lệ trong phản hồi từ API.");
      }
    } catch (error) {
      console.error('Lỗi khi lấy tuyến đường:', error);
    }
  };




  // Gọi API khi có sự thay đổi về vị trí người dùng và khách hàng
  useEffect(() => {
    if (userLocation[0] !== null && customerLocation[0] !== null) {
      fetchRoute(); // Gọi hàm để lấy tuyến đường mới
    }
  }, [userLocation, customerLocation]);





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
      <NormalHeader title="Chi tiết đơn hàng" onLeftPress={() => navigation.goBack()} enableLeftIcon />



    
       <ScrollView showsVerticalScrollIndicator={false} style={styles.containerContent}>
        <Row style={{ padding: GLOBAL_KEYS.PADDING_DEFAULT, marginBottom: 5, justifyContent: 'space-between', flex: 1, backgroundColor: colors.white }}>
          <Title title="Trạng thái đơn hàng" color={colors.green500} />
          <Text style={[styles.status, { color: status === 'cancelled' ? colors.black : colors.green500 }]}>
            {OrderStatus.getLabelByValue(status)}
          </Text>
        </Row>

        {
          status === OrderStatus.SHIPPING_ORDER.value &&

        

            <MapboxGL.MapView style={{height: 450}} styleURL={`https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAPTILES_KEY}`}>
              <MapboxGL.Camera
                zoomLevel={10}
                centerCoordinate={userLocation[0] !== null ? userLocation : [106.700987, 10.776889]}
              />

              {/* Vị trí người dùng */}
              {userLocation[0] !== null && (
                <MapboxGL.PointAnnotation coordinate={userLocation} id="userLocation">
                  <View style={styles.userMarker} />
                </MapboxGL.PointAnnotation>
              )}

              {/* Vị trí khách hàng */}
              {customerLocation[0] !== null && (
                <MapboxGL.PointAnnotation coordinate={customerLocation} id="customerLocation">
                  <View />
                </MapboxGL.PointAnnotation>
              )}

              {/* Vẽ tuyến đường nếu có */}
              {/*  {routeCoordinates.length > 0 && ( */}
              <MapboxGL.ShapeSource
                id="lineSource"
                shape={{
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      geometry: {
                        type: 'LineString',
                        coordinates: convertedCoordinates,
                      },
                    },
                  ],
                }}
              >
                <MapboxGL.LineLayer
                  id="lineLayer"
                  style={{
                    lineColor: colors.blue600,
                    lineWidth: 5,
                  }}
                />
              </MapboxGL.ShapeSource>
              {/*   )} */}
            </MapboxGL.MapView>



  
        }


        {["shippingOrder", "failedDelivery", "readyForPickup", "completed"].includes(status) && (
          <ShipperInfo shipper={shipper} userLocation={userLocation} customerLocation={customerLocation} />
        )}

        <MerchantInfo store={store} />

        <RecipientInfo deliveryMethod={deliveryMethod} owner={owner} shippingAddress={shippingAddress} detail={orderDetail} />

        <ProductsInfo orderItems={orderItems} />

        <PaymentDetails
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
              style={{ flex: 1 }}
              onPress={() => checkDistanceAndApprove(
                'Đơn hàng hoàn thành',
                OrderStatus.COMPLETED.value,
                () => navigation.navigate(OrderGraph.OrderDoneScreen)
              )}
              title='Hoàn thành'
              disabled={!userLocation || !customerLocation}
            />
            <PrimaryButton
              style={{ flex: 1, backgroundColor: colors.orange700 }}
              onPress={() => checkDistanceAndApprove(
                'Giao hàng thất bại',
                OrderStatus.FAILED_DELIVERY.value,
                () => navigation.goBack()
              )}
              title='Giao hàng thất bại'
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



const ShipperInfo = ({ messageClick, userLocation, shipper, customerLocation }) => {
  const openGoogleMaps = () => {
    if (userLocation[0] !== null && customerLocation[0] !== null) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[1]},${userLocation[0]}&destination=${customerLocation[1]},${customerLocation[0]}&travelmode=driving`;
      Linking.openURL(url);
    } else {
      Toaster.show("Không thể lấy vị trí để chỉ đường");
    }
  };

  return (
    <Row style={{ gap: 16, padding: 16, backgroundColor: colors.white, marginBottom: 5 }}>
      <Image
        style={{ width: 40, height: 40 }}
        source={require('../../../assets/images/helmet.png')}
      />
      <Column style={{ flex: 1 }}>
        <Row style={{ justifyContent: 'space-between', flex: 1, backgroundColor: colors.white }}>
          <NormalText text="Nhân viên giao hàng" style={{ fontWeight: '500' }} />
          <TouchableOpacity onPress={openGoogleMaps}>
            <NormalText text="Chỉ đường" style={{ fontWeight: '500', color: colors.primary }} />
          </TouchableOpacity>

        </Row>

        <Text
          style={{ fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.yellow700, fontWeight: '500' }}>
          {shipper?.firstName ? `${shipper.firstName} ${shipper.lastName} ` : 'Đang chuẩn bị ...'}
        </Text>
      </Column>
    </Row>
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

const MerchantInfo = ({ store }) => {
  return (
    <View style={[styles.areaContainer, { paddingHorizontal: 16 }]}>
      <Title title="Cửa hàng" icon="store" />
      <Title title={store.name} titleStyle={{ color: colors.black }} />
      <Text numberOfLines={2} style={styles.normalText}>
        {[
          store.specificAddress,
          store.ward,
          store.district,
          store.province,
        ].join(' ')}
      </Text>
    </View>
  );
};

const RecipientInfo = ({ deliveryMethod, owner, shippingAddress, detail }) => {

  return (
    <Column style={[styles.areaContainer, { paddingHorizontal: 16 }]}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Title title="Người nhận" icon="map-marker" />

        <Row style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity style={styles.iconButton}>
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
  _id,
  shippingFee,
  voucher,
  paymentMethod,
  fulfillmentDateTime,
  orderItems,
  totalPrice,
  status,
}) => {
  const subTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = voucher
    ? voucher.discountType === 'percentage'
      ? (subTotal * voucher.discountValue) / 100
      : voucher.discountValue
    : 0;

  const paymentStatus = (() => {
    if (status === 'completed') return { text: 'Đã thanh toán', color: colors.primary };
    if (paymentMethod === 'cod') return { text: 'Chưa thanh toán', color: colors.orange700 };
    if (status === 'awaitingPayment') return { text: 'Chờ thanh toán', color: colors.pink500 };
    return { text: 'Đã thanh toán', color: colors.primary };
  })();

  const paymentIcon = {
    cod: require('../../../assets/images/logo_vnd.png'),
    payOs: require('../../../assets/images/logo_payos.png'),
    zalopay: require('../../../assets/images/logo_zalopay.png'),
  }[paymentMethod];

  return (
    <View style={{ marginBottom: 8, paddingHorizontal: 16, backgroundColor: colors.white }}>
      <DualTextRow leftText="CHI TIẾT THANH TOÁN" leftTextStyle={{ color: colors.primary, fontWeight: 'bold' }} />
      <OrderId _id={_id} />

      <DualTextRow leftText={`Tạm tính (${orderItems.length} sản phẩm)`} rightText={`${subTotal.toLocaleString()}đ`} />
      <DualTextRow leftText="Phí giao hàng" rightText={`${shippingFee.toLocaleString()}đ`} />
      <DualTextRow leftText="Giảm giá" rightText={`-${(discount || 0).toLocaleString()}đ`} rightTextStyle={{ color: colors.primary }} />
      <DualTextRow
        leftText="Tổng tiền"
        rightText={`${totalPrice.toLocaleString()}đ`}
        leftTextStyle={{ color: colors.primary, fontWeight: '700' }}
        rightTextStyle={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}
      />
      <DualTextRow
        leftText="Trạng thái thanh toán"
        rightText={paymentStatus.text}
        leftTextStyle={{
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderWidth: 1,
          borderRadius: 6,
          borderColor: paymentStatus.color,
          color: paymentStatus.color,
        }}
        rightTextStyle={{ color: paymentStatus.color }}
      />
      <DualTextRow leftText="Thời gian đặt hàng" rightText={new Date(fulfillmentDateTime).toLocaleString('vi-VN')} />


      <Row style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8, justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 12, color: '#000', marginRight: 8 }}>Phương thức thanh toán:</Text>
        <Row style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ width: 24, height: 24 }} source={paymentIcon} />
          <Text style={{ fontSize: 12, color: '#000', marginLeft: 8 }}>{paymentMethod.toUpperCase()}</Text>
        </Row>
      </Row>
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