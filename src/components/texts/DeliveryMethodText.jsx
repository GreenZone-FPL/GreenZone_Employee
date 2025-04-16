import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { colors, GLOBAL_KEYS } from '../../constants'

export const DeliveryMethodText = ({ deliveryMethod, style}) => {
    return (
        <Text style={[styles.statusText, style,{ color: deliveryMethod === 'pickup' ? colors.primary : colors.pink500}]}>
            {deliveryMethod === 'pickup'
                ? 'Tự đến lấy hàng'
                : 'Giao hàng tận nơi'}
        </Text>
    )
}

const styles = StyleSheet.create({
    statusText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
        flex: 1,

    },
})