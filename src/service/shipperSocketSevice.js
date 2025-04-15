import { io } from 'socket.io-client';
import { AppAsyncStorage } from '../utils';


class ShipperSocketService {
  constructor() {
    this.socket = null;
  }

  async initialize() {
    if (this.socket && this.socket.connected) return;

    try {

      const token = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.accessToken);
      const storeId = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.storeId);

      if (!storeId) {
        console.log('Không tìm thấy storeId, không thể kết nối socket!');
        return;
      }

      this.socket = io('https://greenzone.motcaiweb.io.vn', {
        path: '/socket.io/',
        transports: ['websocket'],
        auth: { token },
      });

      this.socket.on('connect', () => {
        this.socket.emit('store.join', storeId);
        console.log(`Shipper join store room: ${storeId}`);
      });

      this.socket.on('order.updateStatus', data => {
        /**
          order.updateStatus: {
          "orderId": "67d98b951f29e18a94db03d5",
          "status": "readyForPickup",
          "message": "🏬 Đơn hàng 67d98b951f29e18a94db03d5 sẵn sàng giao cho khách."
          }
         */
        console.log('order.updateStatus:', data);
      });

      this.socket.on('order.assigned', (data) => {

        console.log('order.assigned:', data);

        this.socket.emit('order.join', data.orderId);


        console.log(`Shipper join order: ${data.orderId}`);

      });

      this.socket.on('connect_error', error => {
        console.error('Lỗi kết nối socket:', error);
      });


      this.socket.on('disconnect', () => {
        console.log('Socket đã ngắt kết nối');
      });


    } catch (error) {
      console.log('Lỗi khi khởi tạo socket:', error);
    }

  }


  disconnect() {
    if (this.socket) {
      this.socket.off('order.assigned');
      this.socket.off('order.updateStatus');
      this.socket.off('disconnect');
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Socket đã ngắt kết nối');
    }
  }

}

// customer 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlVG9rZW4iOiJhY2Nlc3NUb2tlbiIsInBob25lTnVtYmVyIjoiMDkxMjM0NTY3OCIsImlhdCI6MTc0MjMwOTc5MSwiZXhwIjoxNzQzMTczNzkxfQ.UXGO5kpJbvVS43AiLwI8z4VPA5Pp-nDh2vXMlQf4Kik



// merchant nv2
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlVG9rZW4iOiJhY2Nlc3NUb2tlbiIsInBob25lTnVtYmVyIjoiMDkyMjIyMjIyMiIsImlhdCI6MTc0MjMxMDczNSwiZXhwIjoxNzQzMTc0NzM1fQ.Nrq1amC-2d44cfSnKZ_YJZ4x4hE1ekVmI5T4R322eHw
/**
{
  "deliveryMethod": "delivery",
  "fulfillmentDateTime": "2025-03-18T14:28:15.135Z",
  "note": "",
  "totalPrice": 111200,
  "paymentMethod": "cod",
  "consigneeName": "Nguyễn Văn A",
  "consigneePhone": "0987654321",
  "shippingAddress": "Địa chỉ fake, 123 Nguyễn Xí, Bình Thạnh, HCM",
  "store": "67b68d7698c1fc822e49fabd",
  "voucher": "67be982856cc7b945d83be16",
  "orderItems": [
    {
      "variant": "67ae040d145c78765a8f8aff",
      "quantity": 2,
      "price": 47000,
      "toppingItems": [
        {
          "topping": "67aca53c145c78765a8f88b3",
          "quantity": 2,
          "price": 5000
        }
      ]
    },
    {
      "variant": "67c12cc615f3b6d663e4f747",
      "quantity": 2,
      "price": 29000,
      "toppingItems": []
    }
  ],
   "latitude": "10.7769",
   "longitude": "106.7009"
}
 */
export default new ShipperSocketService();
