import { Call, Send2 } from 'iconsax-react-native';
import React from 'react';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { Column, NormalText, Row } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { Title } from './Title';

export const RecipientInfo = ({ detail }) => {
    const handleCall = () => {
        if (!detail?.consigneePhone) return;

        const phoneNumber = `tel:${detail.consigneePhone}`;

        Linking.openURL(phoneNumber).catch((err) => console.error("Failed to open dialer:", err));
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

                <Row style={{ flexDirection: 'row', gap: 16 }}>
                    <TouchableOpacity onPress={handleCall}>
                        <Call size="22" color={colors.green700} variant="Bold" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSend}>
                        <Send2 size="22" color={colors.green700} variant="Bold" />
                    </TouchableOpacity>
                </Row>
            </Row>

            <NormalText
                text={[detail.consigneeName, '|', detail.consigneePhone].join(' ')}
                style={{ color: colors.black }}
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
    },

    normalText: {
        lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
        marginRight: 4,
    },
})
