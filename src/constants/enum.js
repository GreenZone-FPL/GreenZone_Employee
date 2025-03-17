export const DeliveryMethod = Object.freeze({
  PICK_UP: {label: 'Nhận tại cửa hàng', value: 'pickup'},
  DELIVERY: {label: 'Giao hàng tận nơi', value: 'delivery'},
});

export const PaymentMethod = Object.freeze({
  ONLINE: {label: 'online', value: 'online'},
  COD: {label: 'cod', value: 'cod'},
});

export const OrderStatus = Object.freeze({
  AWAITING_PAYMENT: {label: 'Chờ thanh toán', value: 'awaitingPayment'},
  PENDING_CONFIRMATION: {label: 'Chờ xác nhận', value: 'pendingConfirmation'},
  PROCESSING: {label: 'Đang xử lý', value: 'processing'},
  READY_FOR_PICKUP: {label: 'Chờ lấy hàng', value: 'readyForPickup'}, // chỉ dành cho đơn hàng Pickup
  SHIPPING_ORDER: {label: 'Đang giao hàng', value: 'shippingOrder'},
  COMPLETED: {label: 'Hoàn thành', value: 'completed'},
  CANCELLED: {label: 'Đã hủy', value: 'cancelled'},
  FAILED_DELIVERY: {label: 'Giao hàng thất bại', value: 'failedDelivery'},

  getLabels() {
    return Object.values(this).map(status => status.label);
  },
  getLabelByValue(value) {
    const status = Object.values(this).find(status => status.value === value);
    return status ? status.label : 'Không xác định';
  },

  getValues() {
    return Object.values(this).map(status => status.value);
  },
  getMessageByOrder(order) {
    const orderId = order?.data?._id;

    switch (order.data.status) {
      case this.AWAITING_PAYMENT.value:
        return {
          message: `Đơn hàng ${orderId} đang chờ thanh toán${
            order.data.paymentMethod === 'online'
              ? '.\nVui lòng thanh toán trực tuyến.'
              : ''
          }`,
          type: 'warning',
          icon: 'warning',
        };
      case this.PENDING_CONFIRMATION.value:
        return {
          message: `Đơn hàng ${orderId} của bạn đang chờ xác nhận từ cửa hàng.`,
          type: 'warning',
          icon: 'info',
        };
      case this.PROCESSING.value:
        return {
          message: `Đơn hàng ${orderId} đang được xử lý.`,
          type: 'info',
          icon: 'info',
        };
      case this.READY_FOR_PICKUP.value:
        return {
          message: `Đơn hàng ${orderId} đã chuẩn bị xong. Sẵn sàng giao hàng.`,
          type: 'success',
          icon: 'success',
        };
      case this.SHIPPING_ORDER.value:
        return {
          message: `Đơn hàng ${orderId} đang trên đường giao.Hãy theo dõi tình trạng vận chuyển.`,
          type: 'info',
          icon: 'info',
        };
      case this.COMPLETED.value:
        return {
          message: `Đơn hàng ${orderId} đã giao thành công.Cảm ơn bạn đã mua sắm!`,
          type: 'success',
          icon: 'success',
        };
      case this.CANCELLED.value:
        return {
          message: `Đơn hàng ${orderId} đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ hỗ trợ.`,
          type: 'danger',
          icon: 'danger',
        };
      case this.FAILED_DELIVERY.value:
        return {
          message: `Đơn hàng ${orderId} giao hàng không thành công. Vui lòng kiểm tra lại thông tin giao hàng.`,
          type: 'danger',
          icon: 'danger',
        };
      default:
        return {
          message: `Đơn hàng ${orderId} có trạng thái không xác định.`,
          type: 'default',
          icon: 'info',
        };
    }
  },
});

// Cách sử dụng:
// console.log(OrderStatus.getLabels()); // Lấy toàn bộ label
// console.log(OrderStatus.getValues()); // Lấy toàn bộ value

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlVG9rZW4iOiJhY2Nlc3NUb2tlbiIsInBob25lTnVtYmVyIjoiMDkxMTExMTExMSIsImlhdCI6MTc0MTQyNDc0NSwiZXhwIjoxNzQyMjg4NzQ1fQ.i1Mg2wjTqkkkltoOfADAudiqI0_6X0ZDczacKyQyA4Y
