import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import {
  CustomFlatInput,
  FlatInput,
  NormalHeader,
  NormalLoading,
  PrimaryButton
} from '../../components';
import { GLOBAL_KEYS, colors } from '../../constants';
import { AppContext } from '../../context/appContext';

const { width } = Dimensions.get('window');

const UpdateProfileScreen = ({ navigation, route }) => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  const { isLoggedIn } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const { profile } = route.params;

  useEffect(() => {
    console.log('profile = ', profile);

    // Gán dữ liệu vào state
    setLastName(profile.lastName || '');
    setFirstName(profile.firstName || '');
    setEmail(profile.email || '');
    setDob(profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '');
    setGender(
      profile.gender === 'male'
        ? 'Nam'
        : profile.gender === 'female'
          ? 'Nữ'
          : '',
    );
  }, [isLoggedIn]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <NormalLoading visible={loading} />

      <ScrollView>
        <NormalHeader
          title={'Cập nhật thông tin'}
          enableLeftIcon
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Image
              style={styles.avatarImage}
              source={{uri: profile?.avatar || ''}}
            />
            <View style={styles.cameraIconContainer}>
              <Icon
                source="camera"
                color={colors.primary}
                size={GLOBAL_KEYS.ICON_SIZE_SMALL}
              />
            </View>
          </View>
        </View>
        <View style={styles.formContainer}>
          <FlatInput label={'Họ'} value={lastName} setValue={setLastName} />
          <FlatInput label={'Tên'} value={firstName} setValue={setFirstName} />
          <FlatInput
            label={'Email'}
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
          />
          <CustomFlatInput label={'Ngày sinh'} value={dob} setValue={setDob} />
          <CustomFlatInput
            label={'Giới tính'}
            value={gender}
            setValue={setGender}
            rightIcon="arrow-down-drop-circle-outline"
          />
          <PrimaryButton title={'Cập nhật tài khoản'} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fbBg,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.fbBg,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textPrimary,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  avatar: {
    backgroundColor: colors.gray700,
    position: 'relative',
    width: width / 3,
    height: width / 3,
    borderRadius: width / 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    resizeMode: 'contain',
  },
  cameraIconContainer: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    end: 0,
    bottom: 0,
    margin: GLOBAL_KEYS.PADDING_SMALL,
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    borderRadius: GLOBAL_KEYS.ICON_SIZE_DEFAULT / 2,
  },
  formContainer: {
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  lottie: {
    width: 100,
    height: 100,
  },
});

export default UpdateProfileScreen;
