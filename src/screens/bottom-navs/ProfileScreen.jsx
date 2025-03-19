import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { getProfile } from '../../axios/modules';
import { Column, LightStatusBar, NormalLoading, NormalText, Row } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { AuthActionTypes } from '../../reducers/authReducer';
import { AppAsyncStorage } from '../../utils';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const { authDispatch } = useAppContext()
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {

    try {
      setLoading(true);
      const reponse = await getProfile();
      console.log('profile', JSON.stringify(reponse, null, 3));
      setProfile(reponse)


    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile()

  }, [])


  if (loading) {
    return (
      <View style={styles.container}>
        <LightStatusBar />
        <Text style={styles.headerTitle}>Cá nhân</Text>
        <NormalLoading visible={loading} />
      </View>
    )
  }



  return (
    <View style={styles.container}>
      <LightStatusBar />
      <Text style={styles.headerTitle}>Cá nhân</Text>
      <Header profile={profile} />

      <Column style={{ gap: 16 }}>
        <Text style={styles.bodyTitle}>Tùy chọn</Text>
        <ItemRow
          title="Cập nhật tài khoản"
          icon="account-outline"
          onPress={() => {
            navigation.navigate('UpdateProfileScreen', { profile });
          }}
          checkIcon={true}
        />
        <ItemRow title="Hỗ trợ" icon="headphones" checkIcon={true} />
        <ItemRow title="Câu hỏi thường gặp" icon="application-edit-outline" checkIcon={true} />
        <ItemRow title="Điều khoản và điều kiện" icon="comment-edit-outline" checkIcon={true} />
        <ItemRow title="Chính sách quyền riêng tư" icon="eye-outline" checkIcon={true} />
        <ItemRow
          title="Đăng xuất"
          icon="logout"
          checkIcon={false}
          onPress={async () => {
            await AppAsyncStorage.removeData(AppAsyncStorage.STORAGE_KEYS.accessToken);
            await AppAsyncStorage.removeData(AppAsyncStorage.STORAGE_KEYS.refreshToken);
            authDispatch({ type: AuthActionTypes.LOGOUT });
          }}
        />
      </Column>

    </View>
  );
};

const Header = ({ profile }) => {
  if (!profile) return null;

  return (

    <Row style={{ padding: 16, gap: 16, backgroundColor: colors.white }}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={require('../../assets/images/meo2.jpg')}
        />
        <View style={styles.cameraIcon}>
          <Icon
            source={'camera'}
            size={GLOBAL_KEYS.ICON_SIZE_SMALL}
            color={colors.white}
          />
        </View>
      </View>
      <Column>
        <RowContent title={`${profile.firstName} ${profile.lastName}`} icon="account-outline" />
        <RowContent title={profile.phoneNumber} icon="phone-outline" />
        <RowContent
          title={profile.email}
          icon="email-outline"
        />
      </Column>
    </Row>

  );
};



const ItemRow = ({ icon, title, onPress, checkIcon }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemRow}>
      <Row style={{ flex: 1 }}>
        <Icon
          source={icon}
          size={GLOBAL_KEYS.ICON_SIZE_SMALL}
          color={colors.primary}
        />
        <NormalText text={title} />
      </Row>
      {checkIcon && (
        <Icon
          source="arrow-right"
          size={GLOBAL_KEYS.ICON_SIZE_SMALL}
          color={colors.primary}
        />
      )}
    </TouchableOpacity>
  );
};

const RowContent = ({ title, icon }) => {
  return (
    <Row style={styles.rowContent}>
      <Icon
        source={icon}
        size={GLOBAL_KEYS.ICON_SIZE_SMALL}
        color={colors.primary}
      />
      <NormalText text={title} />

    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.fbBg,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    flex: 1
  },

  headerTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },

  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: colors.primary,
    height: width / 5,
    width: width / 5,
    padding: 2,
    elevation: 2.5,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: width,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
  },

  bodyTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    elevation: 1,
  },
});

export default ProfileScreen;
