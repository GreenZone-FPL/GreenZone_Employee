import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {FlatInput, LightStatusBar, PrimaryButton} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {AuthGraph} from '../../layouts/graphs';

const {width} = Dimensions.get('window');

const LoginScreen = props => {
  const {navigation} = props;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
  const [isCheckked, setIsCheckkid] = useState(true);

  const handleSendOTP = () => {
    const phoneRegex = /^(0[1-9][0-9]{8})$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneNumberMessage('Số điện thoại sai định dạng');
    } else {
      setPhoneNumberMessage('');
      navigation.navigate(AuthGraph.VerifyOTPScreen, {phoneNumber});
    }
  };

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <Image
        style={styles.image}
        source={require('../../assets/images/background/register_bg.png')}
      />

      <Text style={styles.headerText}>GreenZone Delivery</Text>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Nhập số điện thoại của bạn</Text>
        <FlatInput
          label="Nhập số điện thoại"
          style={{width: '100%'}}
          placeholder={'Nhập số điện thoại của bạn'}
          setValue={setPhoneNumber}
          value={phoneNumber}
          message={phoneNumberMessage}
        />
        <View style={styles.checkboxContainer}>
          <CustomCheckBox
            isCheckked={isCheckked}
            setIsCheckkid={setIsCheckkid}
          />
          <Text style={styles.checkboxText}>
            Bằng việc đăng ký, tôi đồng ý với
            <Text style={styles.linkText}> Điều khoản sử dụng</Text> và
            <Text style={styles.linkText}> Chính sách bảo mật</Text>.
          </Text>
        </View>
        {isCheckked && (
          <PrimaryButton title="Tiếp theo" onPress={() => handleSendOTP()} />
        )}
      </View>
    </View>
  );
};

const CustomCheckBox = ({isCheckked, setIsCheckkid}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setIsCheckkid(isCheckked);
        }}
        style={styles.checkboxButton}>
        {isCheckked && (
          <Icon
            source="check"
            size={GLOBAL_KEYS.ICON_SIZE_SMALL}
            color={colors.primary}
          />
        )}
      </TouchableOpacity>
    </View>
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
    width: '100%',
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
    fontWeight: 500,
  },
  textNorman: {
    fontSize: 18,
    fontWeight: 500,
    width: '80%',
  },
  textHeder: {
    fontSize: 28,
    fontWeight: 500,
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
