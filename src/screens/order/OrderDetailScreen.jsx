import {Call, Send2} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ActivityIndicator, Icon} from 'react-native-paper';
import {getOrderDetail, updateOrderStatus} from '../../axios';
import {
  DualTextRow,
  HorizontalProductItem,
  LightStatusBar,
  NormalHeader,
  NormalText,
  PrimaryButton,
} from '../../components';
import {GLOBAL_KEYS, colors} from '../../constants';
import {OrderStatus} from '../../constants';

const OrderDetailScreen = ({navigation, route}) => {
  const {orderId} = route.params;
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    try {
      const data = await getOrderDetail(orderId);
      setOrderDetail(data.data);
    } catch (error) {
      console.error('Lỗi lấy chi tiết đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#299345"
        style={{flex: 1, justifyContent: 'center'}}
      />
    );
  }

  if (!orderDetail) {
    return (
      <Text style={{textAlign: 'center', marginTop: 20}}>
        Không tìm thấy đơn hàng.
      </Text>
    );
  }
  

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Chi tiết đơn hàng"
        onLeftPress={() => navigation.goBack()}
        enableLeftIcon={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.containerContent}>
        <OrderInfo {...orderDetail} />
        <RecipientInfo {...orderDetail} />
        <ProductsInfo orderItems={orderDetail.orderItems} />
        <PaymentDetails {...orderDetail} />
      </ScrollView>
    </View>
  );
};

const OrderInfo = ({_id, status, fulfillmentDateTime}) => {
  return (
    <View style={styles.areaContainer}>
      <View style={styles.orderItem}>
        <View style={{flex: 2}}>
          <Text style={styles.orderId}>Mã đơn hàng: {_id}</Text>
          <Text>
            Thời gian: {new Date(fulfillmentDateTime).toLocaleString()}
          </Text>
        </View>
        <Text style={styles.orderStatus}>
          {status === 'readyForPickup' ? 'Sẵn sàng giao' : 'Đang xử lý'}
        </Text>
      </View>
    </View>
  );
};

const ProductsInfo = ({orderItems}) => {
  return (
    <View style={[styles.areaContainer, {borderBottomWidth: 0}]}>
      <View>
        <Title title={'Danh sách sản phẩm'} icon="clipboard-list" />
      </View>

      <FlatList
        data={orderItems}
        keyExtractor={item => item.product._id}
        renderItem={({item}) => {
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
              onAction={() => console.log('Edit product')}
              confirmDelete={() => console.log('Delete product')}
            />
          );
        }}
        contentContainerStyle={styles.flatListContentContainer}
        scrollEnabled={false}
      />
    </View>
  );
};

const RecipientInfo = ({owner, shippingAddress}) => (
  <View>
    <View style={[styles.infoRow, {justifyContent: 'space-between'}]}>
      <View
        style={{
          gap: 10,
          width: '80%',
        }}>
        <Text style={styles.customerName}>
          {owner?.firstName} {owner?.lastName}
        </Text>

        <Text>
         {shippingAddress?.specificAddress}, {shippingAddress?.ward},{' '}
          {shippingAddress?.district}
        </Text>
      </View>

      <View style={{flexDirection: 'row', gap: 10}}>
        <TouchableOpacity style={styles.iconButton}>
          <Call size="24" color="#299345" variant="Bold" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Send2 size="24" color="#299345" variant="Bold" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

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
  // Tính tổng tiền sản phẩm (chưa bao gồm phí giao hàng và giảm giá)
  const subTotal = orderItems.reduce((sum, item) => sum + item.price, 0);

  // Số tiền giảm giá từ voucher (nếu có)
  const discount = voucher
    ? voucher.discountType === 'percentage'
      ? (subTotal * voucher.discountValue) / 100
      : voucher.discountValue
    : 0;

  // Tổng tiền thực tế phải trả
  const paidAmount = totalPrice;

  // Chọn icon phù hợp với phương thức thanh toán
  const getPaymentIcon = method => {
    switch (method) {
      case 'cod':
        return (
          <Image
            style={{width: 24, height: 24}}
            source={require('../../assets/images/logo_vnd.png')}
          />
        );
      case 'payOs':
        return (
          <Image
            style={{width: 24, height: 24}}
            source={require('../../assets/images/logo_payos.png')}
          />
        );
      case 'zalopay':
        return (
          <Image
            style={{width: 24, height: 24}}
            source={require('../../assets/images/logo_zalopay.png')}
          />
        );
    }
  };
  // Xác định trạng thái thanh toán
  const getPaymentStatus = () => {
    if (status === 'completed') {
      return {text: 'Đã thanh toán', color: colors.primary};
    }
    if (paymentMethod === 'cod') {
      return {text: 'Chưa thanh toán', color: 'red'};
    }
    if (status === 'awaitingPayment') {
      return {text: 'Chờ thanh toán', color: 'orange'};
    }
    return {text: 'Đã thanh toán', color: colors.primary};
  };

  const paymentStatus = getPaymentStatus();

  const updateStatus = async (status, deliveryMethod) => {
    try {
      const response = await updateOrderStatus(_id, status, deliveryMethod);
      console.log(`Cập nhật trạng thái đơn hàng thành công:`, response);
      return response;
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái đơn hàng:`, error);
      throw error;
    }
  };
  const showAlert = ({notification, message, onPress}) => {
    Alert.alert(notification, message, [
      {text: 'Huỷ', style: 'cancel'},
      {text: 'Xác Nhận', onPress},
    ]);
  };

  const handleStatusUpdate = async newStatus => {
    try {
      await updateStatus(newStatus);
    } catch (error) {
      console.error(`Chuyển trạng thái đơn hàng thất bại:`, error);
    }
  };

  const handleStatusUpdateWithShipper = async (status, shipperId) => {
    try {
      console.log('Status gửi lên:', status);
      console.log('Shipper ID gửi lên:', shipperId);

      await updateOrderStatus(_id, status, 'delivery', shipperId);
      console.log(`Cập nhật trạng thái thành công:`, status);
    } catch (error) {
      console.error(`Lỗi cập nhật trạng thái đơn hàng:`, error);
    }
  };

  return (
    <View style={{marginBottom: 8}}>
      <DualTextRow
        leftText="CHI TIẾT THANH TOÁN"
        leftTextStyle={{color: colors.primary, fontWeight: 'bold'}}
      />
      <OrderId _id={_id} />
      {[
        {
          leftText: `Tạm tính (${orderItems.length} sản phẩm)`,
          rightText: `${subTotal.toLocaleString()}đ`,
        },
        {
          leftText: 'Phí giao hàng',
          rightText: `${shippingFee.toLocaleString()}đ`,
        },
        {
          leftText: 'Giảm giá',
          rightText: `-${(discount || 0).toLocaleString('vi-VN')}đ`,
          rightTextStyle: {color: colors.primary},
        },
        {
          leftText: 'Trạng thái thanh toán',
          rightText: paymentStatus.text,
          leftTextStyle: {
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderWidth: 1,
            borderRadius: 6,
            borderColor: paymentStatus.color,
            color: paymentStatus.color,
          },
          rightTextStyle: {fontWeight: '700', color: paymentStatus.color},
        },

        {
          leftText: 'Thời gian đặt hàng',
          rightText: new Date(fulfillmentDateTime).toLocaleString('vi-VN'),
        },
      ].map((item, index) => (
        <DualTextRow key={index} {...item} />
      ))}
      {/* Phương thức thanh toán với icon */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 8,
          justifyContent: 'space-between',
        }}>
        <Text style={{fontSize: 12, color: '#000', marginRight: 8}}>
          Phương thức thanh toán:
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {getPaymentIcon(paymentMethod)}
          <Text style={{fontSize: 12, color: '#000', marginLeft: 8}}>
            {paymentMethod.toUpperCase()}
          </Text>
        </View>
      </View>
      {status !== OrderStatus.CANCELLED.value &&
        status !== OrderStatus.FAILED_DELIVERY.value && (
          <View style={styles.buttonContainer}>
            {status === OrderStatus.READY_FOR_PICKUP.value && (
              <>
                <Pressable
                  style={styles.button}
                  onPress={() =>
                    showAlert({
                      notification: 'Xác nhận đơn hàng',
                      message: 'Đơn Đang Được Giao',
                      onPress: () =>
                        handleStatusUpdate(OrderStatus.SHIPPING_ORDER.value),
                    })
                  }>
                  <NormalText
                    text="Đơn Đang Được Giao"
                    style={styles.buttonText}
                  />
                </Pressable>
              </>
            )}
            {status === OrderStatus.SHIPPING_ORDER.value && (
              <>
                <Pressable
                  style={styles.button}
                  onPress={() =>
                    showAlert({
                      notification: 'Hoàn tất đơn hàng',
                      message: 'Hoàn tất đơn hàng',
                      onPress: () =>
                        handleStatusUpdate(OrderStatus.COMPLETED.value),
                    })
                  }>
                  <NormalText text="Hoàn Tất" style={styles.buttonText} />
                </Pressable>
                <Pressable
                  style={styles.button}
                  onPress={() =>
                    showAlert({
                      notification: 'Giao hàng thất bại',
                      message: 'Giao hàng thất bại',
                      onPress: () =>
                        handleStatusUpdate(OrderStatus.FAILED_DELIVERY.value),
                    })
                  }>
                  <NormalText
                    text="Giao hàng thất bại"
                    style={styles.buttonText}
                  />
                </Pressable>
              </>
            )}
          </View>
        )}
    </View>
  );
};
const OrderId = ({_id}) => {
  return (
    <View style={[styles.row, {marginBottom: 6}]}>
      <Text style={styles.normalText}>Mã đơn hàng</Text>
      <Pressable style={styles.row} onPress={() => {}}>
        <Text style={[styles.normalText, {fontWeight: 'bold', marginRight: 8}]}>
          {_id}
        </Text>
        <Icon source="content-copy" color={colors.teal900} size={18} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  containerContent: {
    backgroundColor: colors.white,
    flex: 1,
    gap: 12,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
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
  },

  flatListContentContainer: {
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
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
    borderBottomWidth: 5,
    borderColor: colors.gray200,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gray200,
    borderWidth: 2,
    marginVertical: 16,
  },
  orderItem: {
    backgroundColor: colors.white,
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
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
    height: 20,
    backgroundColor: colors.green200,
    color: colors.orange700,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  customerName: {
    fontWeight: '500',
  },
  phoneButton: {
    backgroundColor: colors.gray200,
    padding: 4,
    borderRadius: 16,
    marginLeft: 'auto',
  },
  customerAddress: {
    marginLeft: 30,
    color: colors.gray700,
  },
});

export default OrderDetailScreen;
