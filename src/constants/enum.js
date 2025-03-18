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

  getValueByLabel(label) {
    const status = Object.values(this).find(status => status.label === label);
    return status ? status.status : 'Không xác định';
  },

  getValues() {
    return Object.values(this).map(status => status.value);
  },
  getMessageInfoByStatus(status) {
    switch (status) {
        case this.AWAITING_PAYMENT.value:
            return { type: "warning", icon: status === this.AWAITING_PAYMENT.value ? "warning" : "info" };
        case this.PENDING_CONFIRMATION.value:
            return { type: "success", icon: "success" };

        case this.PROCESSING.value:
        case this.SHIPPING_ORDER.value:
            return { type: "info", icon: "info" };

        case this.READY_FOR_PICKUP.value:
        case this.COMPLETED.value:
            return { type: "success", icon: "success" };

        case this.CANCELLED.value:
        case this.FAILED_DELIVERY.value:
            return { type: "danger", icon: "danger" };

        default:
            return { type: "default", icon: "info" };
    }
}
});

// Cách sử dụng:
// console.log(OrderStatus.getLabels()); // Lấy toàn bộ label
// console.log(OrderStatus.getValues()); // Lấy toàn bộ value

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlVG9rZW4iOiJhY2Nlc3NUb2tlbiIsInBob25lTnVtYmVyIjoiMDkxMTExMTExMSIsImlhdCI6MTc0MTQyNDc0NSwiZXhwIjoxNzQyMjg4NzQ1fQ.i1Mg2wjTqkkkltoOfADAudiqI0_6X0ZDczacKyQyA4Y
