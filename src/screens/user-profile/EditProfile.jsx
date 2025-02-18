import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {
  NormalHeader,
  FlatInput,
  CustomFlatInput,
  PrimaryButton,
  LightStatusBar,
} from '../../components';
import {GLOBAL_KEYS, colors} from '../../constants';

const EditProfile = props => {
  const {navigation} = props;
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Cập nhập người dùng"
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.headerBackground} />
      <View style={styles.formContainer}>
        <FlatInput label={'Họ'} value={lastName} setValue={setLastName} />
        <FlatInput label={'Tên'} value={firstName} setValue={setFirstName} />
        <FlatInput label={'Email'} value={email} setValue={setEmail} />
        <FlatInput label={'Phone'} value={phone} setValue={setPhone} />
        <CustomFlatInput label={'Ngày sinh'} value={dob} setValue={setDob} />
        <CustomFlatInput
          label={'Giới tính'}
          value={gender}
          setValue={setGender}
          rightIcon="arrow-down-drop-circle-outline"
        />
        <PrimaryButton title={'Cập nhật tài khoản'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    height: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.white,
  },
  formContainer: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
});

export default EditProfile;
