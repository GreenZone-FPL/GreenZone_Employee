import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { getMerchant, getProfile } from '../../axios';
import { Column, LightStatusBar, NormalLoading, NormalText, Row, TitleText } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { AuthActionTypes } from '../../reducers/authReducer';
import shipperSocketSevice from '../../service/shipperSocketSevice';
import { AppAsyncStorage } from '../../utils';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn'
const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const { authDispatch, orderUpdate } = useAppContext()
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [merchant, setMerchant] = useState(null);

  const fetchProfile = async () => {

    try {
      setLoading(true);
      const reponse = await getProfile();

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

  useEffect(() => {
    const loadMerchant = async () => {
      try {
        const storeId = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.storeId);
        if (storeId) {
          const response = await getMerchant(storeId);
          setMerchant(response);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadMerchant();
  }, []);

  const handleSupportPress = () => {
    if (merchant && merchant.phoneNumber) {
      const phoneNumber = merchant.phoneNumber;
      Linking.openURL(`tel:${phoneNumber}`);
    } else {

      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Số điện thoại hỗ trợ không có sẵn!',
        visibilityTime: 2000,
      });
    }
  };


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
    <ScrollView style={styles.container}>
      <LightStatusBar />
      <Text style={styles.headerTitle}>Cá nhân</Text>
      {
        profile && merchant &&
        <Header profile={profile} merchant={merchant} />
      }


      <Column style={{ gap: 16, paddingVertical: 8 }}>
        <Text style={styles.bodyTitle}>Tùy chọn</Text>
        <ItemRow
          title="Thông tin tài khoản"
          icon="account"
          onPress={() => {
            navigation.navigate('ProfileInfoScreen', { profile });
          }}
          checkIcon={true}
        />
        <ItemRow
          title="Liên hệ cửa hàng"
          icon="headphones"
          checkIcon={true}
          onPress={handleSupportPress}
        />




        <ItemRow
          title="Đăng xuất"
          icon="logout"
          checkIcon={false}
          onPress={async () => {
            await AppAsyncStorage.removeData(AppAsyncStorage.STORAGE_KEYS.accessToken);
            await AppAsyncStorage.removeData(AppAsyncStorage.STORAGE_KEYS.refreshToken);
            authDispatch({ type: AuthActionTypes.LOGOUT });
            shipperSocketSevice.disconnect()
            await ZegoUIKitPrebuiltCallService.uninit()
          }}
        />


      </Column>

    </ScrollView>
  );
};

const Header = ({ profile, merchant }) => {
  if (!profile && !merchant) return null;

  return (
    <Column>
      <Row style={{ padding: 16, gap: 16, backgroundColor: colors.white }}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{ uri: profile?.avatar || '' }}
          />
          <View style={styles.cameraIcon}>
            <Icon
              source={'camera'}
              size={GLOBAL_KEYS.ICON_SIZE_SMALL}
              color={colors.white}
            />
          </View>
        </View>

        <Column style={{ flex: 1, backgroundColor: colors.white }}>
          <RowContent title={`${profile?.firstName} ${profile?.lastName}`} icon="account-circle" />
          <RowContent title={profile?.phoneNumber} icon="phone" />
        </Column>

      </Row>
      <Column style={{ backgroundColor: colors.white, padding: 16, gap: 16 }}>
        <TitleText text='Cửa hàng làm việc' />
        <RowContent title={merchant?.name} icon="store" />
        <RowContent
          title={`${merchant?.address}`}
          icon="map-marker" />

        <RowContent title={merchant?.phoneNumber} icon="phone" />
      </Column>

    </Column>

  );
};


const ItemRow = ({ icon, title, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.itemRow}>
      <Row style={{ flex: 1 }}>
        <Icon
          source={icon}
          size={GLOBAL_KEYS.ICON_SIZE_SMALL}
          color={colors.primary}
        />
        <NormalText text={title} />
      </Row>

    </Pressable>
  );
};

const RowContent = ({ title, icon }) => {
  return (
    <Row style={{}}>
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
    flex: 1,
  },

  headerTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    color: colors.black
  },

  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width,
    resizeMode: 'cover',
    height: width / 5,
    width: width / 5,
    padding: 2,
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
