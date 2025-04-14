import { useNavigation, useRoute } from '@react-navigation/native';
import ZegoUIKitPrebuiltCallService, { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import ZegoUIKit, { ZegoToast, ZegoToastType } from '@zegocloud/zego-uikit-rn';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { Column, LightStatusBar, NormalHeader, NormalLoading, NormalText, Row } from '../components';
import { colors } from '../constants';
import { AppAsyncStorage } from '../utils';
import { onUserLogin } from './common';

export default function InviteCallScreen(props) {
  const navigation = useNavigation();
  const route = useRoute();
  const { shipperPhoneNumber } = route.params;
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [invitees, setInvitees] = useState([]);
  const [isToastVisable, setIsToastVisable] = useState(false);
  const [toastExtendedData, setToastExtendedData] = useState({});
  const toastInvisableTimeoutRef = useRef(null);
  const [inviteeInput, setInviteeInput] = useState('');

  console.log('shipperPhoneNumber', shipperPhoneNumber);

  const getUserInfo = async () => {
    try {
      const phoneNumber = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.phoneNumber);
      const lastName = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.lastName);
      if (!phoneNumber) return undefined;
      return { phoneNumber, lastName };
    } catch (e) {
      return undefined;
    }
  };

  const resetToastInvisableTimeout = () => {
    clearTimeout(toastInvisableTimeoutRef.current);
    toastInvisableTimeoutRef.current = setTimeout(() => {
      setIsToastVisable(false);
    }, 3000);
  };

  useEffect(() => {
    Orientation.addOrientationListener((orientation) => {
      let orientationValue = 0;
      if (orientation === 'PORTRAIT') orientationValue = 0;
      else if (orientation === 'LANDSCAPE-LEFT') orientationValue = 1;
      else if (orientation === 'LANDSCAPE-RIGHT') orientationValue = 3;
      console.log('+++++++Orientation+++++++', orientation, orientationValue);
      ZegoUIKit.setAppOrientation(orientationValue);
    });

    getUserInfo().then((info) => {
      if (info) {
        setUserPhoneNumber(info.phoneNumber);
        onUserLogin(info.phoneNumber, info.lastName, props); // Dùng phoneNumber
      } else {
        props.navigation.navigate('LoginScreen');
      }
    });
  }, []);

  useEffect(() => {
    let filteredList = [shipperPhoneNumber]; // Gọi đến số điện thoại của shipper
    setInvitees(filteredList);
  }, []);

  const handleCallInvitationPress = (errorCode, errorMessage, errorInvitees) => {
    console.log('invitees used in call:', invitees);
    if (errorCode === 0) {
      clearTimeout(toastInvisableTimeoutRef.current);
      setIsToastVisable(false);
    } else {
      console.log('Zego call error:', { errorCode, errorMessage, errorInvitees });
      setIsToastVisable(true);
      setToastExtendedData({
        type: ZegoToastType.error,
        text: `error: ${errorCode}\n\n${errorMessage}`,
      });
      resetToastInvisableTimeout();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalHeader title="Gọi điện" onLeftPress={() => {
        navigation.goBack();
        ZegoUIKitPrebuiltCallService.uninit();
      }} />

      <NormalLoading visible={false} />

      <Column style={styles.content}>
        <NormalText text={`shipperPhoneNumber: ${shipperPhoneNumber}`} />

        <Row>


          <ZegoSendCallInvitationButton
            invitees={(() => {
              console.log('📞 Final invitees:', invitees);
              return invitees.map((inviteePhone) => ({
                userID: inviteePhone, // dùng phoneNumber làm userID
                userName: 'user_' + inviteePhone // dùng userName thay vì lastName
              }));
            })()}
            isVideoCall={false}
            resourceID={"zegouikit_call"}
            showWaitingPageWhenGroupCall={true}
            onPressed={handleCallInvitationPress}
          />


          <ZegoSendCallInvitationButton
            invitees={(() => {
              console.log('📞 Final invitees:', invitees);
              return invitees.map((inviteePhone) => ({
                userID: inviteePhone, // dùng phoneNumber làm userID
                userName: 'user_' + inviteePhone // dùng userName thay vì lastName
              }));
            })()}
            isVideoCall={true}
            resourceID={"zegouikit_call"}
            showWaitingPageWhenGroupCall={true}
            onPressed={handleCallInvitationPress}
          />

        </Row>

        <ZegoToast
          visable={isToastVisable}
          type={toastExtendedData.type}
          text={toastExtendedData.text}
        />
      </Column>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center'
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
});
