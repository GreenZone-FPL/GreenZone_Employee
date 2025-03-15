import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {FlatInput, LightStatusBar, PrimaryButton} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {AppGraph} from '../../layouts/graphs';
import {AppAsyncStorage, Toaster} from '../../utils';
import {login} from '../../axios/index';
import {Ani_ModalLoading} from '../../components/animation/Ani_ModalLoading';
import shipperSocketSevice from '../../service/shipperSocketSevice';

const {width} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('0911111111');
  const [password, setPassword] = useState('123456');
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
  const [isChecked, setIsChecked] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);  
  const [phoneNumberError, setPhoneNumberError] = useState(false);

  useEffect(() => {
    const loadAccountInfo = async () => {
      const account = await AppAsyncStorage.readData('userAccount');
      if (account) {
        setPhoneNumber(account.phoneNumber);
        setPassword(account.password);
        setIsChecked(account.checked);
      }
      setIsLoaded(true);
    };

    loadAccountInfo();
  }, []);
  useEffect(() => {
    if (!isLoaded) return;

    const syncAccountInfo = async () => {
      if (isChecked && phoneNumber && password) {
        await AppAsyncStorage.storeData('userAccount', {
          phoneNumber,
          password,
          isChecked,
        });
      } else if (!isChecked) {
        await AppAsyncStorage.removeData('userAccount');
      }
    };
    syncAccountInfo();
  }, [isChecked, phoneNumber, password, isLoaded]);
  const handleLogin = async () => {
    if (phoneNumber.trim().length !== 10 || !/^[0-9]+$/.test(phoneNumber)) {
      setPhoneNumberError(true);
      setPhoneNumberMessage('Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');
      return;
    }
    setLoading(true);

    try {
      const response = await login({phoneNumber, password});
      console.log('>>>>>>>>>>>>>>>>', JSON.stringify(response, null, 2));
      // Kiểm tra dữ liệu trả về có hợp lệ không
      const accessToken = response.data?.token?.accessToken?.token;
      const refreshToken = response.data?.token?.refreshToken?.token;
      const merchant = response.data?.user;
      // Lưu token và thông tin người dùng vào AsyncStorage
      console.log('Lưu Access Token:', accessToken);
      await AppAsyncStorage.storeData('accessToken', accessToken);
      console.log('Lưu thành công!');

      await AppAsyncStorage.storeData('refreshToken', refreshToken);
      await AppAsyncStorage.storeData('merchant', JSON.stringify(merchant));
      await AppAsyncStorage.storeData(
        'storeId',
        response.data?.user?.workingStore,
      );
      await AppAsyncStorage.storeData('phoneNumber', phoneNumber);
  ;
       console.log('✅ Đăng nhập thành công, khởi tạo socket...');
       shipperSocketSevice.initialize(); // Khởi tạo socket sau khi đăng nhập thành công

      // console.log(merchant);
      navigation.navigate(AppGraph.MAIN);

      return response;
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      Toaster.show('Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <Image
        style={styles.image}
        source={require('../../assets/images/logo2.png')}
      />

      <Text style={styles.headerText}>GreenZone Delivery</Text>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Nhập số điện thoại của bạn</Text>
        <FlatInput
          label="Nhập số điện thoại"
          style={{width: '100%'}}
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
        <View style={styles.checkboxContainer}>
          <CustomCheckBox isChecked={isChecked} setIsChecked={setIsChecked} />
          <Text style={styles.checkboxText}>
            Bằng việc đăng ký, tôi đồng ý với
            <Text style={styles.linkText}> Điều khoản sử dụng</Text> và
            <Text style={styles.linkText}> Chính sách bảo mật</Text>.
          </Text>
        </View>
        {isChecked && <PrimaryButton title="Đăng Nhập" onPress={handleLogin} />}
      </View>
      <Ani_ModalLoading loading={loading} message="Đang xử lý..." />
    </View>
  );
};

const CustomCheckBox = ({isChecked, setIsChecked}) => {
  return (
    <TouchableOpacity
      onPress={() => setIsChecked(prev => !prev)}
      style={[
        styles.checkboxButton,
        isChecked && {backgroundColor: colors.primary},
      ]}>
      {isChecked && (
        <Icon
          source="check"
          size={GLOBAL_KEYS.ICON_SIZE_SMALL}
          color={colors.white}
        />
      )}
    </TouchableOpacity>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  formContainer: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    width: width,
  },
  headerText: {
    flexShrink: 1,
    fontSize: 22,
    color: colors.primary,
    marginVertical: '10%',
  },
  title: {
    flexShrink: 1,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    alignItems: 'center',
  },
  checkboxText: {
    flexShrink: 1,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  linkText: {
    color: colors.primary,
  },
  checkboxButton: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
