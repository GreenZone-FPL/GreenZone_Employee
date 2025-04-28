import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {
  DeliveryMethodText,
  DualTextRow,
  NormalText,
  Row,
  StatusText,
  TitleText,
} from '../../../components';
import { colors, DeliveryMethod, GLOBAL_KEYS, OrderStatus } from '../../../constants';

export const PaymentDetails = ({ detail }) => {
  const [showFull, setShowFull] = useState(false)
  const {
    _id,
    deliveryMethod,
    shippingFee,
    cancelReason,
    voucher,
    paymentMethod,
    orderItems,
    totalPrice,
    status,
    createdAt,
    pendingConfirmationAt,
    readyForPickupAt,
    shippingOrderAt,
    completedAt,
    cancelledAt,
  } = detail;

  const subTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  console.log('detail', JSON.stringify(detail, null, 3));

  const discount = voucher
    ? voucher.discountType === 'percentage'
      ? (subTotal * voucher.value) / 100
      : voucher.value
    : 0;

  const getPaymentStatus = () => {
    if (status === 'completed') {
      return { text: 'Đã thanh toán', color: colors.primary };
    } else if (
      paymentMethod === 'online' &&
      status !== OrderStatus.AWAITING_PAYMENT.value
    ) {
      return { text: 'Đã thanh toán', color: colors.primary };
    } else if (status === 'awaitingPayment') {
      return { text: 'Chờ thanh toán', color: colors.pink500 };
    } else {
      return { text: 'Chưa thanh toán', color: colors.orange700 };
    }
  };

  const paymentStatus = getPaymentStatus();

  const calculateTotalOrderPrice = orderItems => {
    if (!Array.isArray(orderItems)) return 0;

    return orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  return (
    <View
      style={{
        marginBottom: 8,
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.white,
      }}>
      <Row style={{ marginBottom: 8, justifyContent: 'space-between' }}>
        <TitleText
          style={{
            color: colors.lemon,
            fontWeight: 'bold',
            fontSize: 16,
          }}
          text='Chi tiết đơn hàng' />
        <Pressable
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => {
            setShowFull(!showFull)
          }}>
          <NormalText text='Xem thêm' />
          <Icon source='chevron-down' size={24} color={colors.lemon} />
        </Pressable>


      </Row>

      {
        showFull &&
        <>
          <OrderId _id={_id} />
          <Row
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 6,
            }}>
            <NormalText text="Phương thức giao hàng" />
            <DeliveryMethodText
              deliveryMethod={detail?.deliveryMethod}
              style={{ textAlign: 'right' }}
            />
          </Row>

          <Row
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
                color: colors.black,
                marginRight: 8,
              }}>
              Trạng thái đơn hàng
            </Text>
            <StatusText status={status} />
          </Row>


          <DualTextRow
            leftText={`Tạm tính (${orderItems.length} sản phẩm)`}
            rightText={`${(
              calculateTotalOrderPrice(orderItems) || 0
            ).toLocaleString('vi-VN')}đ`}
          />

          {
            deliveryMethod === DeliveryMethod.DELIVERY.value &&

            <DualTextRow
              leftText="Phí giao hàng"
              rightText={`${shippingFee.toLocaleString()}đ`}
            />
          }

          <DualTextRow
            leftText={
              detail?.voucher?.name
                ? `Giảm giá (${detail.voucher.name})`
                : `Giảm giá`
            }
            rightText={`-${(discount || 0).toLocaleString('vi-VN')}đ`}
            rightTextStyle={{ color: colors.primary }}
          />

          <DualTextRow
            leftText="Trạng thái thanh toán"
            rightText={paymentStatus.text}
            rightTextStyle={{ color: paymentStatus.color }}
          />
          {cancelReason && (
            <DualTextRow
              leftText="Lý do hủy đơn"
              rightText={cancelReason}
              rightTextStyle={styles.normalText}
            />
          )}
          {createdAt && (
            <DualTextRow
              leftText="Thời gian tạo đơn"
              rightText={new Date(createdAt).toLocaleString('vi-VN')}
            />
          )}

          {pendingConfirmationAt && (
            <DualTextRow
              leftText="Thời gian chờ xác nhận"
              rightText={new Date(pendingConfirmationAt).toLocaleString(
                'vi-VN',
              )}
            />
          )}

          {readyForPickupAt && (
            <DualTextRow
              leftText="Thời gian sẵn sàng lấy hàng"
              rightText={new Date(readyForPickupAt).toLocaleString('vi-VN')}
            />
          )}

          {shippingOrderAt && (
            <DualTextRow
              leftText="Thời gian giao hàng"
              rightText={new Date(shippingOrderAt).toLocaleString('vi-VN')}
            />
          )}

          {completedAt && (
            <DualTextRow
              leftText="Thời gian nhận hàng"
              rightText={new Date(completedAt).toLocaleString('vi-VN')}
            />
          )}

          {cancelledAt && (
            <DualTextRow
              leftText="Thời gian hủy đơn"
              rightText={new Date(cancelledAt).toLocaleString('vi-VN')}
            />
          )}

          <Row
            style={{
              alignItems: 'center',
              marginVertical: 6,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
                color: colors.black,
                marginRight: 8,
              }}>
              Phương thức thanh toán:
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {paymentMethod === 'online' ? (
                <Image
                  source={require('../../../assets/images/onl.jpg')}
                  style={{ width: 22, height: 22 }}
                />
              ) : (
                <Image
                  source={require('../../../assets/images/logo_vnd.png')}
                  style={{ width: 22, height: 22 }}
                />
              )}
              <Text
                style={{
                  fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
                  color: colors.black,
                  marginLeft: 8,
                }}>
                {paymentMethod === 'online' ? 'Thanh toán online' : 'Tiền mặt'}
              </Text>
            </View>
          </Row>
        </>
      }



      <DualTextRow
        leftText="Tổng tiền"
        rightText={`${totalPrice.toLocaleString('vi-VN')}đ`}
        rightTextStyle={{
          color: colors.orange700,
          fontWeight: '700',
          fontSize: 18,
        }}
        leftTextStyle={{ color: colors.black, fontWeight: '500' }}
      />
    </View>
  );
};

const OrderId = ({ _id }) => {
  const handleCopy = () => {
    Clipboard.setString(_id);
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Đã sao chép mã đơn hàng!',
      visibilityTime: 2000,
      text1Style: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
      },
    });
  };

  return (
    <View style={[styles.row, { marginBottom: 6 }]}>
      <Text style={styles.normalText}>Mã đơn hàng</Text>
      <Pressable style={styles.row} onPress={handleCopy}>
        <Text style={[styles.normalText, { fontWeight: 'bold', marginRight: 8 }]}>
          {_id}
        </Text>
        <Icon source="content-copy" color={colors.teal900} size={18} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  areaContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    marginBottom: 5,
    flex: 1
  },

  normalText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  snackbar: {
    position: 'absolute',
    bottom: 0, // Đặt Snackbar ở dưới cùng
    left: 0,
    right: 0,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftColumn: {
    alignItems: 'center',
    position: 'relative',
    paddingTop: 24,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: colors.primary,
    zIndex: 1,
  },
  verticalLine: {
    position: 'absolute',
    top: 24,
    width: 2,
    height: '200%',
    backgroundColor: 'green',
    zIndex: 0,
  },
  rightContent: {
    flex: 1,
    paddingLeft: 5,
  },
  bubble: {
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: 10,
  },
  timeText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    marginBottom: 4,
  },
  titleText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
});
