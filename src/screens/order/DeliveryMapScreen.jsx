import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { getOrderDetail, updateOrderStatus } from '../../axios';
import { ActionDialog, Column, NormalHeader, NormalText, PrimaryButton, Row } from '../../components';
import { colors, OrderStatus } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { AuthGraph, MainGraph, OrderGraph } from '../../layouts/graphs';
import { Toaster } from '../../utils';

const { width } = Dimensions.get('window');

const DeliveryMapScreen = ({ navigation, route }) => {

    const animationRef = useRef(null);
    const [actionDialogVisible, setActionDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [approveAction, setApproveAction] = useState(null);
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const { orderId } = route.params;
    const { setOrderDualStatuses } = useAppContext();

    
    const fetchOrderDetail = async () => {
        try {
            const response = await getOrderDetail(orderId);
            setOrderDetail(response);

        } catch (error) {
            console.error('error', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [orderId]);


    const onApprove = (message, newStatus, callback) => {
        setActionDialogVisible(true);
        setDialogMessage(message);
        setApproveAction(() => async () => {
            try {
                const oldStatus = orderDetail?.status

                await updateOrderStatus(orderId, newStatus);
                await fetchOrderDetail();
                setOrderDualStatuses({ status: newStatus, oldStatus })
                Toaster.show('Cập nhật đơn hàng thành công')
                if (callback) {
                    callback()
                }
            } catch (error) {
                console.log("error", error);
                Toaster.show('Cập nhật đơn hàng thất bại')
            } finally {
                setActionDialogVisible(false);
            }
        });
    };

    useEffect(() => {
        const loopAnimation = () => {
            animationRef.current?.play(0, 60);
            setTimeout(loopAnimation, 1000);
        };

        loopAnimation();

        return () => clearTimeout();
    }, []);



    return (
        <Column style={{ flex: 1 }}>
            <NormalHeader title="Giao Hàng" enableLeftIcon={true} onLeftPress={() => navigation.goBack()} />

            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ width: '100%', height: '70%' }}>
                        <Image
                            source={require('../../assets/images/map.png')}
                            style={{ width: '100%', height: '100%' }}
                        />
                        <View style={styles.lottieContainer}>
                            <LottieView
                                ref={animationRef}
                                source={require('../../assets/animations/shipbear.json')}
                                autoPlay={false}
                                loop={false}
                                style={styles.lottieView}
                            />
                        </View>
                    </View>

                    <CustomerInfo navigation={navigation} orderDetail={orderDetail} />

                </ScrollView>

                <View style={{ padding: 16 }}>
                    {orderDetail?.status === OrderStatus.FAILED_DELIVERY.value ? (
                        <PrimaryButton
                            onPress={() => navigation.reset({
                                index: 0,
                                routes: [{ name: MainGraph.graphName }],
                            })}
                            title="Quay về trang chủ"
                        />
                    ) : (
                        <Row style={{ gap: 16 }}>
                            <PrimaryButton
                                style={{ flex: 1 }}
                                onPress={() => onApprove("Hoàn tất đơn hàng", OrderStatus.COMPLETED.value, () => navigation.navigate(OrderGraph.OrderDoneScreen))}
                                title="Hoàn thành"
                            />
                            <PrimaryButton
                                style={{ flex: 1, backgroundColor: colors.orange700 }}
                                onPress={() => onApprove("Giao hàng thất bại", OrderStatus.FAILED_DELIVERY.value)}
                                title="Giao hàng thất bại"
                            />
                        </Row>
                    )}
                </View>

            </View>

            <ActionDialog
                visible={actionDialogVisible}
                title="Xác nhận"
                content={dialogMessage}
                cancelText="Đóng"
                approveText="Đồng ý"
                onCancel={() => setActionDialogVisible(false)}
                onApprove={approveAction}
            />
        </Column>
    );

};

const CustomerInfo = ({ navigation, orderDetail }) => {
    const shipper = orderDetail?.shipper;
    const shippingAddress = orderDetail?.shippingAddress;

    return (
        <Column style={{ padding: 16, flex: 1 }}>
            <Row style={{ marginVertical: 8, gap: 16, justifyContent: 'space-between' }}>
                <Row>
                    <Icon source='account' size={24} color={colors.primary} />
                    <NormalText text={`${shippingAddress?.consigneeName} || ${shippingAddress?.consigneePhone}`} style={{ fontWeight: '500' }} />
                </Row>

                <Row style={{ gap: 16 }}>
                    <TouchableOpacity style={styles.phoneButton}>
                        <Icon source='phone' size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate(AuthGraph.ChatWithUser)}>
                        <Icon source='message-badge-outline' size={22} color={colors.primary} />
                    </TouchableOpacity>
                </Row>
            </Row>

            <Row style={{ marginVertical: 8 }}>
                <Icon source='map-marker' size={22} color={colors.primary} />
                <NormalText 
                    text={`${shippingAddress?.specificAddress}, ${shippingAddress?.ward}, ${shippingAddress?.district}, ${shippingAddress?.province}`}
                    style={{ color: colors.gray700 }} 
                />
            </Row>

            {orderDetail?.status === OrderStatus.FAILED_DELIVERY.value && (
                <NormalText text={OrderStatus.getLabelByValue(orderDetail?.status)} style={{ color: colors.red900, fontWeight: '500' }} />
            )}
        </Column>
    );
};


export default DeliveryMapScreen;

const styles = StyleSheet.create({
    lottieContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottieView: {
        width: 200,
        height: 200,
    },
});

