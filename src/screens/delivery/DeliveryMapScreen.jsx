import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { NormalHeader, PrimaryButton } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { Icon } from 'react-native-paper'
import { AuthGraph } from '../../layouts/graphs';

const {width} = Dimensions.get('window');

const DeliveryMapScreen = (props) => {
    const navigation = props.navigation;
  return (
    <View style={{flex: 1}}>
        <NormalHeader title='Giao Hàng' enableLeftIcon={true} onLeftPress={() => navigation.goBack()}/>
        <View style={{height: '70%'}}>
            <Image source={require('../../assets/images/map.png')} style={{width: '100%', height: '100%'}}/>
        </View>
        <View style={{height: '30%', borderRadius: 6, backgroundColor: colors.white, padding: 16, gap: 10}}>
            <CustomerInfo navigation={navigation} />
            <PrimaryButton title='Bắt đầu giao hàng'/>
        </View>
    </View>
  )
}

const CustomerInfo = ({ navigation }) => (
    <View>
        <View style={styles.infoRow}>
            <Icon source='account' size={24} color={colors.primary} />
            <Text style={styles.customerName}>Nguyễn Văn A</Text>
            <View style={{flexDirection: 'row', gap: 16}}>
                <TouchableOpacity style={styles.phoneButton}>
                    <Icon source='phone' size={24} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.phoneButton} 
                    onPress={() => navigation.navigate(AuthGraph.ChatWithUser)} 
                >
                    <Icon source='message-badge-outline' size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.infoRow}>
            <Icon source='map-marker' size={24} color={colors.primary} />
            <Text>Giao đến</Text>
        </View>
        <Text style={styles.customerAddress}>123 Đường ABC, Quận 1, TP.HCM</Text>
    </View>
);

export default DeliveryMapScreen

const styles = StyleSheet.create({
    infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
            gap: 10
        },
        customerName: {
            fontWeight: '500',
            marginLeft: 10,
        },
        phoneButton: {
            backgroundColor: colors.gray200,
            padding: 6,
            borderRadius: 16,
            marginLeft: 'auto',
        },
        customerAddress: {
            marginLeft: 20,
            color: colors.gray700,
        },
})