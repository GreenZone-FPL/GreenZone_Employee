import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { Column, FlatInput, LightStatusBar, OverlayStatusBar, PrimaryButton } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { AppGraph } from '../../layouts/graphs';
import { AppAsyncStorage, Toaster } from '../../utils';
import { login2 } from '../../axios/index';
import { Ani_ModalLoading } from '../../components/animation/Ani_ModalLoading';
import shipperSocketSevice from '../../service/shipperSocketSevice';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('0911111111');
  const [password, setPassword] = useState('123456');
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);

  const handleLogin = async () => {
    if (phoneNumber.trim().length !== 10 || !/^[0-9]+$/.test(phoneNumber)) {
      setPhoneNumberError(true);
      setPhoneNumberMessage('Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');
      return;
    }

    try {
      setLoading(true);

      await login2({ phoneNumber, password });
      console.log('✅Khởi tạo socket...');

      await shipperSocketSevice.initialize();

      navigation.navigate(AppGraph.MAIN);

    } catch (error) {
      console.log('error', error);
      Toaster.show('Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Column style={styles.container}>
      <LightStatusBar />
      <Image
        style={styles.image}
        source={require('../../assets/images/logo2.png')}
      />

      <Text style={styles.headerText}>GreenZone Delivery</Text>

      <Column style={styles.formContainer}>

        <FlatInput
          label="Nhập số điện thoại"
          style={{ width: '100%' }}
          placeholder="Nhập số điện thoại của bạn"
          setValue={setPhoneNumber}
          value={phoneNumber}
          message={phoneNumberMessage}
        />
        <FlatInput
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          value={password}
          setValue={setPassword}
          secureTextEntry={true}
          isPasswordVisible={isPasswordVisible}
          setIsPasswordVisible={setIsPasswordVisible}
        />

        <PrimaryButton title="Đăng Nhập" onPress={handleLogin} />
      </Column>
      <Ani_ModalLoading loading={loading} message="Đang xử lý..." />
    </Column>
  );
};



export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fbBg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  image: {
    width: width / 2,
    height: width / 2,
  },
  formContainer: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    width: width,
  },
  headerText: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: '700'
  }
});
