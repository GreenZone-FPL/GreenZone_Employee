import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {
  NormalHeader,
  FlatInput,
  CustomFlatInput,
  PrimaryButton,
} from '../../components';
import {GLOBAL_KEYS} from '../../constants';
import {colors} from 'react-native-elements';

const EditProfile = props => {
  const {navigation} = props;
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  return (
    <View style={{flexDirection: 'column'}}>
      <NormalHeader
        title="Update Profile"
        onLeftPress={() => navigation.goBack()}
      />
      <View
        style={{
          height: GLOBAL_KEYS.GAP_DEFAULT,
          backgroundColor: colors.white,
          borderBottomLeftRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2,
          borderBottomRightRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2,
        }}></View>
      <View
        style={{
          padding: GLOBAL_KEYS.PADDING_DEFAULT,
          gap: GLOBAL_KEYS.GAP_DEFAULT,
        }}>
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

export default EditProfile;
