import {io} from 'socket.io-client';
import {AppAsyncStorage} from '../utils';
import mitt from 'mitt';

class ShipperSocketService {
  constructor() {
    this.socket = null;
    this.emitter = mitt(); // Tạo emitter để phát sự kiện
  }

  async initialize() {
    if (!this.socket) {
      try {
        const token = await AppAsyncStorage.readData(
          AppAsyncStorage.STORAGE_KEYS.accessToken,
        );
        const storeId = await AppAsyncStorage.readData('storeId');
        console.log('Token:', token);
        console.log('storeId:', storeId);

        if (!token || !storeId) {
          console.log(
            'Không tìm thấy token hoặc storeId, không thể kết nối socket!',
          );
          return;
        }

        this.socket = io('https://greenzone.motcaiweb.io.vn', {
          path: '/socket.io/',
          transports: ['websocket'],
          auth: {token},
        });

        this.socket.on('connect', () => {
          console.log('✅ Shipper đã kết nối:', this.socket.id);
          this.socket.emit('store.join', storeId);
          console.log(`🚀 Shipper tham gia phòng cửa hàng: ${storeId}`);
        });

        this.socket.on('order.updateStatus', data => {
          console.log(
            '📦 Nhận được order.updateStatus:',
            JSON.stringify(data, null, 2),
          );
          this.emitter.emit('order.updateStatus', data); // Phát sự kiện

          if (data.status === 'readyForPickup') {
            console.log(`🚀 Tham gia room với orderId: ${data.orderId}`);
            this.socket.emit('order.join', data.orderId);
          } this.emitter.emit('order.join', data); // Phát sự kiện
        });

        this.socket.on('order.assigned', data => {
          console.log(
            '📩 Nhận được order.assigned:',
            JSON.stringify(data, null, 2),
          );
         
        });

        this.socket.on('disconnect', () => {
          console.log('❌ Socket đã ngắt kết nối');
        });

        this.socket.on('connect_error', error => {
          console.error('⚠️ Lỗi kết nối:', error);
        });

        this.socket.onAny((event, ...args) => {
          console.log(
            `📡 Nhận sự kiện: ${event}`,
            JSON.stringify(args, null, 2),
          );
        });
      } catch (error) {
        console.log('❌ Lỗi khi khởi tạo socket:', error);
      }
    }
  }

  on(event, callback) {
    this.emitter.on(event, callback);
  }

  off(event, callback) {
    this.emitter.off(event, callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Socket đã ngắt kết nối');
    }
  }
}

export default new ShipperSocketService();
