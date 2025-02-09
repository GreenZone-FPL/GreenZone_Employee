import {StyleSheet, Text, View, SafeAreaView, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {
  CustomFlatInput,
  FlatInput,
  LightStatusBar,
  NormalHeader,
  PrimaryButton,
} from '../../components';
import {GLOBAL_KEYS, colors} from '../../constants';
import {Icon} from 'react-native-paper';
import {AuthGraph} from '../../layouts/graphs';
const {width} = Dimensions.get('window');

const RegisterStepTwoScreen = props => {
  const {navigation} = props;

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Đăng ký người giao hàng"
        onLeftPress={() => navigation.goBack()}
      />
      <Body />
      <Footer />
      <PrimaryButton
        style={styles.button}
        title="Gửi"
        onPress={() => navigation.navigate(AuthGraph.LoginScreen)}
        Icon
      />
    </SafeAreaView>
  );
};

const Body = () => {
  const [trafficArea, setTrafficArea] = useState('Go Vap');
  const [citizenIdentification, setCitizenIdentification] = useState(
    'xxxx-xxxx-xxxx-xxxx',
  );
  const [xxxx, setXXXX] = useState('xxxx-xxxx-xxxx-xxxx');

  return (
    <View>
      <View style={styles.formColumn}>
        <View style={styles.centerColum}>
          <Text style={styles.text}>
            Hoàn tất quá trình đăng ký để làm người giao hàng trên GreenZone
          </Text>
        </View>

        <CustomFlatInput
          label={'Khu vực giao'}
          value={trafficArea}
          setValue={setTrafficArea}
          rightIcon="arrow-down-drop-circle-outline"
        />
        <CustomFlatInput
          label={'Cccd'}
          value={citizenIdentification}
          setValue={setCitizenIdentification}
          rightIcon="arrow-down-drop-circle-outline"
        />
        <FlatInput label={'xxxx'} value={xxxx} setValue={setXXXX} />
      </View>
    </View>
  );
};

const Footer = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.uploadContainer}>
        <Icon
          source="camera"
          size={GLOBAL_KEYS.ICON_SIZE_LARGE + 4}
          color={colors.gray400}
        />
        <Text style={styles.uploadText}>Tải lên mặt trước CCCD</Text>
      </View>
      <View style={styles.uploadContainer}>
        <Icon
          source="camera"
          size={GLOBAL_KEYS.ICON_SIZE_LARGE + 4}
          color={colors.gray400}
        />
        <Text style={styles.uploadText}>Tải lên mặt sau CCCD</Text>
      </View>
    </View>
  );
};

export default RegisterStepTwoScreen;

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
  centerColum: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  formColumn: {
    flexDirection: 'column',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    justifyContent: 'center',
  },
  headerContainer: {
    width: width,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    alignItems: 'center',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  uploadContainer: {
    width: width - GLOBAL_KEYS.PADDING_DEFAULT * 2,
    height: 150,
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
  button: {
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
});
