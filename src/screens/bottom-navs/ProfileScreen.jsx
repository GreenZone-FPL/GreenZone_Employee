import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {LightStatusBar} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {Icon} from 'react-native-paper';
import {AuthGraph} from '../../layouts/graphs';

const {width} = Dimensions.get('window');

const ProfileScreen = ({navigation}) => {
  const goScreenName = name => {
    navigation.navigate(name);
  };

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <Header />
      <Body goScreenName={goScreenName} />
    </View>
  );
};

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Cá nhân</Text>
      <View style={styles.headerContent}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{
              uri: 'https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
            }}
          />
          <View style={styles.cameraIcon}>
            <Icon
              source={'camera'}
              size={GLOBAL_KEYS.ICON_SIZE_SMALL}
              color={colors.white}
            />
          </View>
        </View>
        <View style={styles.userInfo}>
          <RowContent title={'Phong Nguyen'} icon="account-outline" />
          <RowContent title={'0936887373'} icon="phone-outline" />
          <RowContent
            title={'nguyenghongphong@gmail.com'}
            icon="email-outline"
          />
        </View>
      </View>
    </View>
  );
};

const Body = ({goScreenName}) => {
  return (
    <View style={styles.bodyContainer}>
      <Text style={styles.bodyTitle}>Options</Text>
      <ItemRow
        title="Edit Profile"
        icon="account-outline"
        onPress={() => goScreenName('EditProfile')}
        checkIcon={true}
      />
      <ItemRow title="Support" icon="headphones" checkIcon={true} />
      <ItemRow title="FAQs" icon="application-edit-outline" checkIcon={true} />
      <ItemRow
        title="Terms and Conditions"
        icon="comment-edit-outline"
        checkIcon={true}
      />
      <ItemRow title="Privacy Policy" icon="eye-outline" checkIcon={true} />
      <ItemRow
        title="Log Out"
        icon="logout"
        checkIcon={false}
        onPress={() => goScreenName(AuthGraph.LoginScreen)}
      />
    </View>
  );
};

const ItemRow = ({icon, title, onPress, checkIcon}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemRow}>
      <View style={styles.itemRowContent}>
        <Icon
          source={icon}
          size={GLOBAL_KEYS.ICON_SIZE_SMALL}
          color={colors.primary}
        />
        <Text style={styles.itemRowText}>{title}</Text>
      </View>
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

const RowContent = ({title, icon}) => {
  return (
    <View style={styles.rowContent}>
      <Icon
        source={icon}
        size={GLOBAL_KEYS.ICON_SIZE_SMALL}
        color={colors.primary}
      />
      <Text style={styles.rowContentText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.fbBg,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  headerContainer: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  headerTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT * 2,
    borderBottomRightRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 4,
    borderBottomLeftRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 4,
    elevation: 1.5,
  },
  headerContent: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    alignItems: 'center',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
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
  userInfo: {
    flexDirection: 'column',
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  bodyContainer: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
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
    elevation: 2.5,
  },
  itemRowContent: {
    flexDirection: 'row',
    width: '80%',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  itemRowText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  rowContent: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_SMALL,
    alignItems: 'center',
  },
  rowContentText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
});

export default ProfileScreen;
