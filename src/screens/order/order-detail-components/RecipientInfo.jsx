import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import ZegoUIKit from '@zegocloud/zego-uikit-rn';
import React, { useEffect } from 'react';
import { Linking, Pressable, StyleSheet } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { Icon } from 'react-native-paper';
import { Column, NormalText, Row, CustomCallButton } from '../../../components';
import { colors, GLOBAL_KEYS, OrderStatus } from '../../../constants';
import { Title } from './Title';
import { useNavigation } from '@react-navigation/native';

export const RecipientInfo = ({ detail }) => {
    const navigation = useNavigation()
    const { consigneeName, consigneePhone } = detail;

    useEffect(() => {
        const handleOrientationChange = (orientation) => {
            let orientationValue = 0;
            if (orientation === 'LANDSCAPE-LEFT') orientationValue = 1;
            else if (orientation === 'LANDSCAPE-RIGHT') orientationValue = 3;
            console.log('📱 Orientation:', orientation, orientationValue);
            ZegoUIKit.setAppOrientation(orientationValue);
        };

        Orientation.addOrientationListener(handleOrientationChange);
        return () => {
            Orientation.removeOrientationListener(handleOrientationChange);
        };
    }, []);

    const handleCallInvitationPress = (errorCode, errorMessage, errorInvitees) => {
        if (errorCode !== 0) {
            console.log('🚨 Zego call error:', {
                errorCode,
                errorMessage,
                errorInvitees: errorInvitees ?? '❌ Tất cả người nhận không hợp lệ hoặc chưa đăng ký signaling'
            });
        } else {
            console.log('📞 Cuộc gọi đã được gửi thành công');
        }
    };



    const handleSend = () => {
        if (!detail?.consigneePhone) return;

        const message = `sms:${detail.consigneePhone}`;

        Linking.openURL(message).catch((err) => console.error("Failed to open SMS app:", err));
    };

    return (
        <Column style={styles.areaContainer}>
            <Row style={{ justifyContent: 'space-between' }}>
                <Title title="Người nhận" />



                {
                    [OrderStatus.SHIPPING_ORDER.value, OrderStatus.READY_FOR_PICKUP.value]
                        .includes(detail.status) &&
                    <Row>
                        <CustomCallButton userName={consigneeName} userID={consigneePhone} navigation={navigation} />
                        {/* <ZegoSendCallInvitationButton
                        invitees={[
                            {
                                userID: consigneePhone,
                                userName: consigneeName
                            }
                        ]}
                        isVideoCall={false}
                        resourceID={"zegouikit_call"}
                        showWaitingPageWhenGroupCall={true}
                        onPressed={handleCallInvitationPress}

                    /> */}

                        <Pressable style={styles.iconButton} onPress={handleSend}>
                            <Icon
                                source="message"
                                color={colors.blue600}
                                size={20}
                            />
                        </Pressable>
                    </Row>

                }



            </Row>

            <NormalText
                text={[detail.consigneeName, detail.consigneePhone].join(' - ')}
                style={{ color: colors.black, fontWeight: '500' }}
            />

            <NormalText text={detail.shippingAddress} style={styles.normalText} />

        </Column>
    );
};


const styles = StyleSheet.create({
    areaContainer: {
        backgroundColor: colors.white,
        paddingVertical: 12,
        marginBottom: 5,
        paddingHorizontal: 16
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
