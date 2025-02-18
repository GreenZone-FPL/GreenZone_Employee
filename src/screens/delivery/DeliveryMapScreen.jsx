import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { NormalHeader, PrimaryButton } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { Icon } from 'react-native-paper';
import { AuthGraph, OrderGraph } from '../../layouts/graphs';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const DeliveryMapScreen = (props) => {
    const navigation = props.navigation;
    const animationRef = useRef(null);

    useEffect(() => {
        const loopAnimation = () => {
            animationRef.current?.play(0, 60); // Chạy animation từ frame 0 đến 60 (1.5s)
            setTimeout(loopAnimation, 1000); // Gọi lại sau 1giây
        };

        loopAnimation(); // Chạy lần đầu tiên

        return () => clearTimeout(); // Xóa timeout khi unmount
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <NormalHeader title='Giao Hàng' enableLeftIcon={true} onLeftPress={() => navigation.goBack()} />
            <View style={{ height: '70%', position: 'relative' }}>
                <Image 
                    source={require('../../assets/images/map.png')} 
                    style={{ width: '100%', height: '100%' }} 
                />
                <LottieView 
                    ref={animationRef} 
                    source={require('../../assets/animations/shipbear.json')} 
                    autoPlay={false} 
                    loop={false} 
                    style={StyleSheet.absoluteFillObject} 
                />
            </View>
            <View style={{ height: '30%', borderRadius: 6, backgroundColor: colors.white, padding: 16, gap: 10 }}>
                <CustomerInfo navigation={navigation} />
                <PrimaryButton title='Bắt đầu giao hàng' onPress={() => navigation.navigate(OrderGraph.OrderDoneScreen)} />
            </View>
        </View>
    );
};

const CustomerInfo = ({ navigation }) => (
    <View>
        <View style={styles.infoRow}>
            <Icon source='account' size={24} color={colors.primary} />
            <Text style={styles.customerName}>Nguyễn Văn A</Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
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

export default DeliveryMapScreen;

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
});
