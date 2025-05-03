import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text } from 'react-native';
import { login2 } from '../../axios';
import { Column, LightStatusBar, NormalInput, NormalLoading, PrimaryButton } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { AppGraph } from '../../layouts/graphs';
import { AuthActionTypes } from '../../reducers/authReducer';
import shipperSocketSevice from '../../service/shipperSocketSevice';
import { Toaster } from '../../utils';
import { onUserLoginZego } from '../../zego/common';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('0322222222');
  const [password, setPassword] = useState('123456');
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { authState, authDispatch } = useAppContext()


  const handleLogin = async () => {
    if (phoneNumber.trim().length !== 10 || !/^[0-9]+$/.test(phoneNumber)) {
      setPhoneNumberMessage('Số điện thoại không hợp lệ');
      return;
    }

    if (password.length == 0) {
      setPasswordMessage('Trường này không được để trống');
      return;
    }
    if (password.length !== 6) {
      setPasswordMessage('Mật khẩu phải có 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      const response = await login2({ phoneNumber, password });

      if (response) {
        authDispatch({
          type: AuthActionTypes.LOGIN,
          payload: { lastName: response.user.lastName }
        })
        await onUserLoginZego(phoneNumber, response.user.lastName, navigation)
 
      
        navigation.navigate(AppGraph.MAIN);
      }


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
      <NormalLoading visible={loading} />

      <Text style={styles.headerText}>GreenZone Delivery</Text>

      <Column style={styles.formContainer}>

        <NormalInput
          required
          label="Nhập số điện thoại"
          style={{ width: '100%' }}
          placeholder="Nhập số điện thoại của bạn"
          setValue={(value) => {
            setPhoneNumber(value)
            setPhoneNumberMessage('')

          }}
          value={phoneNumber}
          invalidMessage={phoneNumberMessage}
        />
        <NormalInput
          required
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          value={password}
          setValue={(value) => {
            setPassword(value)
            setPasswordMessage('')
          }}
          secureTextEntry={true}
          isPasswordVisible={isPasswordVisible}
          setIsPasswordVisible={setIsPasswordVisible}
          invalidMessage={passwordMessage}
        />

        <PrimaryButton onPress={handleLogin} title='Đăng nhập' />
      </Column>

    </Column>
  );
};



export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  image: {
    width: width / 1.5,
    height: width / 1.5,
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
  },
});
