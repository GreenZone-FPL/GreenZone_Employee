import { Call, Send2 } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { getOrderDetail, updateOrderStatus } from '../../axios';
import { ActionDialog, Column, DualTextRow, HorizontalProductItem, LightStatusBar, NormalHeader, NormalLoading, NormalText, PrimaryButton, Row } from '../../components';
import { DeliveryMethod, GLOBAL_KEYS, OrderStatus, colors } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { ShoppingGraph } from '../../layouts/graphs';
import { Toaster } from '../../utils';

const OrderDetailScreen = props => {
  const { navigation, route } = props;
  const { orderId } = route.params;
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionDialogVisible, setActionDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [approveAction, setApproveAction] = useState(null);
  const { updateOrderMessage, setOrderDualStatuses } = useAppContext();

  const fetchOrderDetail = async () => {
    try {
      const response = await getOrderDetail(orderId);
      setOrderDetail(response);
    } catch (error) {
      console.error('error', error);
    } finally {
      setLoading(false);
    }
  };

  const onApprove = (message, newStatus) => {
    setActionDialogVisible(true);
    setDialogMessage(message);
    setApproveAction(() => async () => {
      try {
        const oldStatus = orderDetail?.status

        await updateOrderStatus(_id, newStatus);
        await fetchOrderDetail();
        setOrderDualStatuses({ status: newStatus, oldStatus })
        Toaster.show('Cập nhật đơn hàng thành công')
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

        {["shippingOrder", "failedDelivery", "readyForPickup", "completed"].includes(status) && (
          <ShipperInfo shipper={shipper} />
        )}

        <MerchantInfo store={store} />

        <RecipientInfo deliveryMethod={deliveryMethod} owner={owner} shippingAddress={shippingAddress} />

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
              onPress={() => onApprove("Hoàn tất đơn hàng", OrderStatus.COMPLETED.value)}
              title='Hoàn thành'
            />

            <PrimaryButton
              style={{ flex: 1, backgroundColor: colors.orange700 }}
              onPress={() => onApprove("Giao hàng thất bại", OrderStatus.FAILED_DELIVERY.value)}
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



const ShipperInfo = ({ messageClick, shipper }) => {

  return (
    <Row style={{ gap: 16, padding: 16, backgroundColor: colors.white, marginBottom: 5 }}>
      <Image
        style={{ width: 40, height: 40 }}
        source={require('../../assets/images/helmet.png')}
      />
      <Column style={{ flex: 1 }}>
        <NormalText text="Nhân viên giao hàng" style={{ fontWeight: '500' }} />
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

const RecipientInfo = ({ deliveryMethod, owner, shippingAddress }) => {
  // Chọn nguồn dữ liệu phù hợp
  const recipientName =
    deliveryMethod === 'pickup'
      ? `${owner.lastName} ${owner.firstName}`
      : shippingAddress.consigneeName;

  const recipientPhone =
    deliveryMethod === 'pickup'
      ? owner.phoneNumber
      : shippingAddress.consigneePhone;

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
        text={[recipientName, '||', recipientPhone].join(' ')}
        style={{ color: colors.black }}
      />

      {deliveryMethod === DeliveryMethod.DELIVERY.value && (
        <Text style={styles.normalText}>
          {`${shippingAddress.specificAddress}, ${shippingAddress.ward}, ${shippingAddress.district}, ${shippingAddress.province}`}
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
    cod: require('../../assets/images/logo_vnd.png'),
    payOs: require('../../assets/images/logo_payos.png'),
    zalopay: require('../../assets/images/logo_zalopay.png'),
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
  status: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.green500, fontWeight: '500' },
});

export default OrderDetailScreen