import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Call } from 'iconsax-react-native';
import { colors, GLOBAL_KEYS } from '../../constants';

const CallWithUser = () => {
  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Image
        source={{ uri: 'https://tech24.vn/upload/post/images/2024/09/26/675/avatar-vo-tri-2.jpg' }} // Thay bằng URL ảnh thực tế
        style={styles.avatar}
      />
      {/* Tên người dùng */}
      <Text style={styles.name}>Tannie</Text>
      {/* Trạng thái cuộc gọi */}
      <Text style={styles.status}>Đang gọi...</Text>

      {/* Nút kết thúc cuộc gọi */}
      <TouchableOpacity style={styles.endCallButton}>
        <Call size="32" color={colors.white}/>
      </TouchableOpacity>
    </View>
  );
};

export default CallWithUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray900,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  status: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray400,
    marginBottom: 50,
  },
  endCallButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
