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

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <Image
        style={styles.image}
        source={require('../../assets/images/background/background_login.png')}
      />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Nhập mã nhân viên của bạn</Text>
        <FlatInput label="Id của bạn" value={idStaff} setValue={setIdStaff} />
        <View style={styles.checkboxContainer}>
          <CustomCheckBox />
          <Text style={styles.checkboxText}>
            By signing up I agree to the
            <Text style={styles.linkText}>Terms of use</Text> and
            <Text style={styles.linkText}> Privacy Policy</Text>.
          </Text>
        </View>
        <PrimaryButton
          title="Tiếp theo"
          onPress={() => navigation.navigate(AuthGraph.LoginStepTwoScreen)}
        />
      </View>
    </View>
  );
};

const CustomCheckBox = () => {
  const [isCheckked, setIsCheckkid] = useState(false);
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
    top: '-10%',
  },
  formContainer: {
    top: '-20%',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    width: width,
  },
  title: {
    flexShrink: 1,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
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
