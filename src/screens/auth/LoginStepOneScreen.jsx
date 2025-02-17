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

const LoginStepOneScreen = props => {
  const {navigation} = props;
  const [idStaff, setIdStaff] = useState('xxxx-xxxx-3333');
  const [isCheckked, setIsCheckkid] = useState(false);

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <Image
        style={styles.image}
        source={require('../../assets/images/background/background_login.png')}
      />
      <View style={styles.imageContainer}>
        <Image
          style={styles.image1}
          source={require('../../assets/images/background/background_content.png')}
        />
        <Text style={styles.textNorman}>Trở thành Đối tác của GreenZone</Text>
        <Text style={styles.textHeder}>Nhận thu nhập ổn định hàng tháng</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Nhập mã nhân viên của bạn</Text>
        <FlatInput label="Id của bạn" value={idStaff} setValue={setIdStaff} />
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
          <PrimaryButton
            title="Tiếp theo"
            onPress={() => navigation.navigate(AuthGraph.LoginStepTwoScreen)}
          />
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
          setIsCheckkid(!isCheckked);
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

export default LoginStepOneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    marginTop: '-10%',
  },
  imageContainer: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    top: '10%',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },

  image1: {
    width: 321,
    height: 283,
  },
  formContainer: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    width: width,
  },
  title: {
    flexShrink: 1,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  textNorman: {
    fontSize: 18,
    fontWeight: 500,
    width: '80%',
  },
  textHeder: {
    fontSize: 28,
    fontWeight: 500,
    width: '80%',
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
