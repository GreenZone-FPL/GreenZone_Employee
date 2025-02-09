import {StyleSheet, Text, View, SafeAreaView, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {
  FlatInput,
  LightStatusBar,
  NormalHeader,
  PrimaryButton,
} from '../../components';
import {GLOBAL_KEYS, colors} from '../../constants';
import {Icon} from 'react-native-paper';
import {AuthGraph} from '../../layouts/graphs';

const {width} = Dimensions.get('window');

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.text}>
        Hoàn tất quá trình đăng ký để làm người giao hàng trên GreenZone
      </Text>
      <View style={styles.uploadContainer}>
        <Icon
          source="camera"
          size={GLOBAL_KEYS.ICON_SIZE_LARGE + 4}
          color={colors.gray400}
        />
        <Text style={styles.uploadText}>Tải lên ảnh người giao hàng</Text>
      </View>
    </View>
  );
};

const Body = () => {
  const [lastName, setLastName] = useState('Nguyen');
  const [firstName, setFirstName] = useState('Phong');
  const [phone, setPhone] = useState('0936887373');
  const [password, setPassword] = useState('Phong');
  const [email, setEmail] = useState('Phong@gmail.com');
  const [confirmPassword, setConfirmPassword] = useState('Phong');

  return (
    <View>
      <View style={styles.formRow}>
        <FlatInput
          style={styles.inputHalf}
          label="Tên"
          value={firstName}
          setValue={setFirstName}
        />
        <FlatInput
          style={styles.inputHalf}
          label="Họ"
          value={lastName}
          setValue={setLastName}
        />
      </View>
      <View style={styles.formColumn}>
        <FlatInput label="Phone" value={phone} setValue={setPhone} />
        <FlatInput label="Email" value={email} setValue={setEmail} />
        <FlatInput
          label="Mật khẩu"
          value={password}
          setValue={setPassword}
          isPasswordVisible
          secureTextEntry
        />
        <FlatInput
          label="Xác nhận mật khẩu"
          value={confirmPassword}
          setValue={setConfirmPassword}
          isPasswordVisible
          secureTextEntry
        />
      </View>
    </View>
  );
};

const RegisterStepOneScreen = props => {
  const {navigation} = props;
  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Đăng ký người giao hàng"
        onLeftPress={() => navigation.goBack()}
      />
      <Header />
      <Body />
      <PrimaryButton
        style={styles.button}
        title="Tiếp theo"
        onPress={() => navigation.navigate(AuthGraph.RegisterStepTwoScreen)}
      />
    </SafeAreaView>
  );
};

export default RegisterStepOneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  content: {
    width: width,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    alignItems: 'center',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  text: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    width: '60%',
  },
  headerContainer: {
    width: width,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    alignItems: 'center',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  uploadContainer: {
    width: 150,
    height: 100,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    textAlign: 'center',
  },
  formRow: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    justifyContent: 'space-between',
    paddingHorizontal: GLOBAL_KEYS.GAP_DEFAULT,
    width: width,
  },
  inputHalf: {
    width: width / 2 - GLOBAL_KEYS.PADDING_DEFAULT * 1.5,
  },
  formColumn: {
    flexDirection: 'column',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  button: {
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
});
