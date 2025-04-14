import { Call, Send2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import ZegoUIKit, { ZegoToast, ZegoToastType } from '@zegocloud/zego-uikit-rn';
import Orientation from 'react-native-orientation-locker';
import React, { useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Column, NormalText, Row } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { Title } from './Title';
import { Icon } from 'react-native-paper'
import { AppAsyncStorage } from '../../../utils';
import { onUserLoginZego } from '../../../zego/common';

export const RecipientInfo = ({ detail }) => {
    const { shipper, consigneeName, consigneePhone } = detail;
    const navigation = useNavigation();
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [isToastVisable, setIsToastVisable] = useState(false);
    const [toastExtendedData, setToastExtendedData] = useState({});
    const toastInvisableTimeoutRef = useRef(null);
   

    useEffect(() => {
      getUserInfo().then(async (info) => {
        if (info) {
          setUserPhoneNumber(info.phoneNumber);
          await onUserLoginZego(info.phoneNumber, info.lastName, props);
          setIsZegoReady(true); // Đợi init xong mới hiển thị nút gọi
        } else {
          console.log('Đăng nhập lại');
        }
      });
    }, []);
    
    // console.log('📦 detail Info:', JSON.stringify(detail, null, 2));


    const getUserInfo = async () => {
        try {
            const phoneNumber = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.phoneNumber);
            const lastName = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.lastName);
            console.log('phoneNumber', phoneNumber, 'lastName', lastName)
            // phoneNumber 0822222222 lastName Phan Văn Trị
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
            console.log('📱 Orientation:', orientation, orientationValue);
            ZegoUIKit.setAppOrientation(orientationValue);
        });

       
    }, []);

    useEffect(() => {
        getUserInfo().then(async (info) => {
          if (info) {
            setUserPhoneNumber(info.phoneNumber);
            await onUserLoginZego(info.phoneNumber, info.lastName, props);
            
          } else {
            console.log('Đăng nhập lại');
          }
        });
      }, []);

    const handleCallInvitationPress = (errorCode, errorMessage, errorInvitees) => {
        console.log('📞 invitees used in call:', [consigneePhone]);
        if (errorCode === 0) {
            clearTimeout(toastInvisableTimeoutRef.current);
            setIsToastVisable(false);
        } else {
            console.log('🚨 Zego call error:', { errorCode, errorMessage, errorInvitees });
            setIsToastVisable(true);
            setToastExtendedData({
                type: ZegoToastType.error,
                text: `error: ${errorCode}\n\n${errorMessage}`,
            });
            resetToastInvisableTimeout();
        }
    };


    const handleSend = () => {
        if (!detail?.consigneePhone) return;

        const message = `sms:${detail.consigneePhone}`;

        Linking.openURL(message).catch((err) => console.error("Failed to open SMS app:", err));
    };

    return (
        <Column style={[styles.areaContainer, { paddingHorizontal: 16 }]}>
            <Row style={{ justifyContent: 'space-between' }}>
                <Title title="Người nhận" icon="map-marker" />

                <Row>
                    <ZegoSendCallInvitationButton
                        invitees={[
                            {
                                userID: consigneePhone,
                                userName: 'user_' + consigneeName
                            }
                        ]}
                        isVideoCall={false}
                        resourceID={"zegouikit_call"}
                        showWaitingPageWhenGroupCall={true}
                        onPressed={handleCallInvitationPress}
                    />

                    <Pressable style={styles.iconButton} onPress={handleSend}>
                        <Icon
                            source="message"
                            color={colors.blue600}
                            size={20}
                        />
                    </Pressable>

                </Row>


            </Row>

            <NormalText
                text={[detail.consigneeName,  detail.consigneePhone].join(' - ')}
                style={{ color: colors.black, fontWeight: '500' }}
            />

            <NormalText text={detail.shippingAddress} style={styles.normalText} />
            <ZegoToast
                visable={isToastVisable}
                type={toastExtendedData.type}
                text={toastExtendedData.text}
            />
        </Column>
    );
};


const styles = StyleSheet.create({
    areaContainer: {
        backgroundColor: colors.white,
        paddingVertical: 12,
        marginBottom: 5,
    },

    normalText: {
        lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
        marginRight: 4,
    },
    iconButton: {
        padding: 11,
        borderRadius: 24,
        backgroundColor: colors.fbBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8

    },
})
