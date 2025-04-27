import { io } from 'socket.io-client';
import { AppAsyncStorage } from '../utils';


class ShipperSocketService {
  constructor() {
    this.socket = null;
  }

  async initialize( updateOrderCallBack) {
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

     
      this.socket.on('order.updateStatus', data => {
        console.log(' Received new order:', data);
        if (updateOrderCallBack) {
          updateOrderCallBack(data);
        }
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
      this.socket.off('order.updateStatus');
      this.socket.off('disconnect');
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Socket đã ngắt kết nối');
    }
  }

}


export default new ShipperSocketService();
