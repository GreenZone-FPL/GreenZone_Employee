import Geolocation from '@react-native-community/geolocation';
import MapboxGL from '@rnmapbox/maps';
import polyline from 'polyline';
import React, { useEffect, useRef, useState } from 'react';
import { Linking, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { getOrderDetail } from '../../axios';
import { Column, LightStatusBar, NormalHeader, NormalLoading, OverlayStatusBar, TitleText } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { Toaster } from '../../utils';
import database from '@react-native-firebase/database';

const GOONG_API_KEY = 'stT3Aahcr8XlLXwHpiLv9fmTtLUQHO94XlrbGe12';
const GOONG_MAPTILES_KEY = 'pBGH3vaDBztjdUs087pfwqKvKDXtcQxRCaJjgFOZ';

MapboxGL.setAccessToken(GOONG_API_KEY);

const MapScreen = props => {
  const { navigation, route } = props;

  const { orderId } = route.params;
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);


  const { updateOrderMessage, setOrderDualStatuses } = useAppContext();
  const cameraRef = useRef(null);
  const [userLocation, setUserLocation] = useState([null, null]);
  const [customerLocation, setCustomerLocation] = useState([null, null]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const convertedCoordinates = routeCoordinates.map(([lat, lng]) => [lng, lat]);

  console.log(convertedCoordinates);

 // vị trí shipper
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
          // console.log('Vị trí người dùng', position)
        },
        error => console.log(error),
        { timeout: 5000 },
      );

    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // useEffect(() => {
  //   const watchId = Geolocation.watchPosition(
  //     position => {
  //       const {longitude, latitude} = position.coords;
  //       setUserLocation([longitude, latitude]);

  //       // Di chuyển camera (nếu cần)
  //       if (cameraRef.current) {
  //         cameraRef.current.setCamera({
  //           centerCoordinate: [longitude, latitude],
  //           zoomLevel: 14,
  //           animationDuration: 1000,
  //         });
  //       }

  //       // ✅ Cập nhật Firebase Realtime Database
  //       if (orderId) {
  //       database()
  //         .ref(`/locations/${orderId}`)
  //         .set({
  //           latitude,
  //           longitude,
  //           timestamp: Date.now(),
  //         })
  //         .then(() => {
  //           console.log('Đã cập nhật vị trí thành công!');
  //         })
  //         .catch(err => {
  //           console.error('Lỗi khi cập nhật vị trí lên Firebase:', err);
  //         });

  //       }
  //     },
  //     error => console.log(error),
  //     {enableHighAccuracy: true, distanceFilter: 10, interval: 3000},
  //   );

  //   return () => {
  //     if (watchId != null) {
  //       Geolocation.clearWatch(watchId);
  //     }
  //   };
  // }, []);

  const fetchOrderDetail = async () => {
    try {
      const response = await getOrderDetail(orderId);
      setOrderDetail(response);
      const latitude = response.latitude;
      const longitude = response.longitude;
      setCustomerLocation([longitude, latitude]);
      // console.log(`Vị trí giao hàng: Latitude: ${latitude}, Longitude: ${longitude}`);
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

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId, updateOrderMessage]);


  if (loading) {
    return (
      <View style={styles.container}>
        <LightStatusBar />
        <NormalHeader
          title="Bản đồ"
          onLeftPress={() => navigation.goBack()}
        />
        <NormalLoading visible={true} />
      </View>
    );
  }

  const openGoogleMaps = () => {
    if (userLocation[0] !== null && customerLocation[0] !== null) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[1]},${userLocation[0]}&destination=${customerLocation[1]},${customerLocation[0]}&travelmode=driving`;
      Linking.openURL(url);
    } else {
      Toaster.show("Không thể lấy vị trí để chỉ đường");
    }
  }

  return (
    <View style={styles.container}>
      <OverlayStatusBar />

      <Column style={styles.containerContent}>
        <NormalHeader title="Bản đồ" onRightPress={() => navigation.goBack()} rightIcon='close' enableRightIcon />

        <TouchableOpacity onPress={openGoogleMaps} disabled={loading} style={{
          backgroundColor: colors.white, flexDirection: 'row', gap: 6, padding: 16, alignItems: 'center'
        }}>
          <TitleText text="Chỉ đường" style={{ fontWeight: '500', color: colors.primary }} />
          <Icon source={'chevron-right'} color={colors.primary} size={20} />
        </TouchableOpacity>

        <MapboxGL.MapView style={{ height: 500 }} styleURL={`https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAPTILES_KEY}`}>
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

      </Column>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center'
  },
  containerContent: {
    backgroundColor: colors.fbBg,
    marginTop: StatusBar.currentHeight,
    borderTopRightRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderTopLeftRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    flexDirection: 'column'
  },

  userMarker: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: 'white',
  },

});

export default MapScreen