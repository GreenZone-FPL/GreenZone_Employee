import axiosInstance from '../axiosInstance';
export const getOrders = async status => {
  try {
    const response = await axiosInstance.get('/v1/order/store/all', {
      params: {status}, // Truyền status vào API
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi API lấy đơn hàng:', error);
    return {success: false, data: []};
  }
};


export const getOrderDetail = async orderId => {
  try {
    const response = await axiosInstance.get(`/v1/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId,
  status,
  deliveryMethod,
  shipperId,
) => {
  try {
    const body = {status};

    // Nếu là đơn "delivery" và chuyển sang "readyForPickup", thì cần shipper
    if (deliveryMethod === 'delivery' && status === 'readyForPickup') {
      body.shipper = shipperId;
    }

    const response = await axiosInstance.patch(
      `/v1/order/${orderId}/status`,
      body,
    );

    return response.data;
  } catch (error) {
    console.log('Lỗi API:', error.response?.data || error.message);
    throw error;
  }
};
