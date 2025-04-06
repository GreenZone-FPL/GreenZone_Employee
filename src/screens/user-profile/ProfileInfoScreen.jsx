import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  NormalHeader,
  NormalText
} from '../../components';
import { LabelInput } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';

const { width } = Dimensions.get('window');

const ProfileInfoScreen = ({ navigation, route }) => {
  const { profile } = route.params;

  return (

    <ScrollView style={styles.container}>

      <NormalHeader
        title="Thông tin tài khoản"
        enableLeftIcon
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.avatar}>
        <Image
          style={styles.avatarImage}
          source={{
            uri:
              profile.avatar ||
              'https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg',
          }}
        />
      </View>


      <View style={styles.formContainer}>


        <LabelInput label="Họ" />


        <NormalText text={profile.firstName} style={styles.input} />


        <LabelInput label="Tên" />


        <NormalText text={profile.lastName} style={styles.input} />


        <LabelInput label="Giới tính" />


        <NormalText
          text={
            profile.gender === 'male'
              ? 'Nam'
              : profile.gender === 'female'
                ? 'Nữ'
                : profile.gender === 'other'
                  ? 'Khác'
                  : ''
          }
          style={styles.input}
        />

      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    gap: 24,
  },
  avatar: {
    backgroundColor: colors.white,
    width: width / 3,
    height: width / 3,
    borderRadius: width / 6,
    alignSelf: 'center',
    marginBottom: 30
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    resizeMode: 'contain',
    borderRadius: 80,
  },

  formContainer: {
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 14
  },

});

export default ProfileInfoScreen;
