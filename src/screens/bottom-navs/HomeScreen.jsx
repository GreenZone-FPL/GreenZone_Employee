import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CustomTabView, LightStatusBar, NormalHeader, StoreAddress, DualTextRow, PaymentMethodRow, PrimaryButton } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { Icon } from 'react-native-paper'
import {Tab, TabView} from '@rneui/themed';
import { AuthGraph } from '../../layouts/graphs';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const [index, setIndex] = useState(0);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const navigation = useNavigation();

    const handleOrderPress = (orderId) => {
        setExpandedOrderId(prevOrderId => (prevOrderId === orderId ? null : orderId));
    };

    const handleConfirmOrder = (orderId) => {
        navigation.navigate(AuthGraph.DeliveryMapScreen, { orderId });
    };

    const filteredOrders = (status) => {
        return orders.filter(order => order.status === status);
    };

    return (
        <View style={styles.container}>
         <LightStatusBar />
         <NormalHeader title="Đơn hàng" />
            <Tab value={index} onChange={setIndex} scrollable={true} indicatorStyle={{colors: colors.primary}}>
                <Tab.Item title="Tất cả" />
                <Tab.Item title="Chờ xử lý" />
                <Tab.Item title="Đang xử lý" />
                <Tab.Item title="Hoàn tất" />
                <Tab.Item title="Hủy" />
            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring">
                {['Tất cả', 'Chờ xử lý', 'Đang xử lý', 'Hoàn tất', 'Hủy'].map((status, i) => (
                    <TabView.Item key={i} style={styles.tabView}>
                        <StoreAddress title='Quận 12'>

                        
                        <FlatList
                            data={status === 'Tất cả' ? orders : filteredOrders(status)}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={(props) => renderOrderItem(props, handleOrderPress, expandedOrderId, handleConfirmOrder)}
                        />
                        </StoreAddress>
                    </TabView.Item>
                ))}
            </TabView>
        </View>
    );
};

const renderOrderDetails = (orderId, handleConfirmOrder) => {
    const orderDetail = orderDetails.find(order => order.orderId === orderId);
    if (!orderDetail) return null;

    return (
        <View style={styles.orderDetailContainer}>
            <CustomerInfo customer={orderDetail.customer} />
            <ProductList items={orderDetail.items} />
            <PaymentDetails paymentMethod={orderDetail.paymentMethod} />
            <TimeOrder time={orderDetail.time} />
            <PrimaryButton title="Xác thực đơn hàng" onPress={() => handleConfirmOrder(orderId)} />
        </View>
    );
};

const CustomerInfo = ({ customer }) => (
    <View>
        <View style={styles.infoRow}>
            <Icon source='account' size={24} color={colors.primary} />
            <Text style={styles.customerName}>{customer.name}</Text>
            <TouchableOpacity style={styles.phoneButton}>
                <Icon source='phone' size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
            <Icon source='map-marker' size={24} color={colors.primary} />
            <Text>Giao đến</Text>
        </View>
        <Text style={styles.customerAddress}>{customer.address}</Text>
    </View>
);


const ProductList = ({ items }) => (
    <View>
        <View style={styles.infoRow}>
            <Icon source='shopping' size={24} color={colors.primary} />
            <Text>Danh sách sản phẩm</Text>
        </View>
        {items.map(product => (
            <View key={product.productId} style={styles.productItem}>
                <Image source={product.image} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                    <Text style={styles.productDetails}>{product.size}, {product.variant}</Text>
                    <Text style={{color: colors.orange700}}>note: {product.note}</Text>
                </View>
                <Text>x{product.quantity}  </Text>
                <Text>{product.price.toLocaleString()}đ</Text>
            </View>
        ))}
    </View>
);

const renderOrderItem = ({ item }, handleOrderPress, expandedOrderId, handleConfirmOrder) => (
    <View>
        <TouchableOpacity style={styles.orderItem} onPress={() => handleOrderPress(item.orderId)}>
            <View>
                <Text style={styles.orderId}>Mã đơn hàng: #{item.orderId}</Text>
                <Text>Thời gian: {item.time}</Text>
            </View>
            <Text style={styles.orderStatus}>{item.status}</Text>
        </TouchableOpacity>
        {expandedOrderId === item.orderId && renderOrderDetails(item.orderId, handleConfirmOrder)}
    </View>
);
const PaymentDetails = ({ paymentMethod  }) => {
    return(

   
    <>
        <DualTextRow leftText="CHI TIẾT THANH TOÁN" leftTextStyle={styles.paymentHeader} />
        {paymentDetails.map((detail, index) => (
            <DualTextRow key={index} {...detail} />
        ))}

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{borderWidth: 1, borderRadius: 6, padding: 2, borderColor: colors.primary, color: colors.primary}}>Đã thanh toán</Text>
            <Text>73.000đ</Text>
        </View>
        <PaymentMethodRow rightText={paymentMethod} />
    </>
     );
};
const TimeOrder = ({ time }) => (
    <View style={{backgroundColor: colors.green200, borderRadius: 6, padding: 10, marginVertical: 10}}>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <View>
                <Text style={{color: colors.primary, fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER}}>Đơn hẹn giờ</Text>
                <Text style={{color: colors.primary}}>Hôm nay</Text>
                <Text style={{color: colors.primary}}>{time},Tue 12/02/2025</Text>
            </View>
            <View style={{borderWidth: 1, borderRadius: 6, borderColor: colors.gray700, backgroundColor: colors.white, alignItems: 'center' , padding: 10, borderStyle: 'dashed',}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon source='clock-time-three-outline' size={24} color={colors.primary} />
                    <Text style={{color: colors.primary, fontSize: 18}}>Còn lại</Text>
                </View>
                <Text style={{color: colors.primary, fontSize: 18, fontWeight: '500'}}>1:04h</Text>
            </View>
        </View>
       
    </View>
);

const paymentDetails = [
    { leftText: 'Tạm tính (2 sản phẩm)', rightText: '69.000đ' },
    { leftText: 'Phí giao hàng', rightText: '18.000đ' },
    { leftText: 'Giảm giá', rightText: '-14.000đ', rightColor: colors.primary },
];


const orders = [
    { id: 1, status: 'Chờ xử lý', orderId: '02312', time: '9:30' },
    { id: 2, status: 'Đang xử lý', orderId: '02313', time: '10:00' },
    { id: 3, status: 'Hoàn tất', orderId: '02314', time: '12:30' },
    { id: 4, status: 'Hủy', orderId: '02315', time: '15:30' },
    { id: 5, status: 'Chờ xử lý', orderId: '02316', time: '19:00' },
];

const orderDetails = [
    {
        orderId: '02312',
        time: '19:00',
        items: [
            {
                productId: 'P001',
                name: 'Combo 2 trà sữa chân châu hoàng kim',
                quantity: 2,
                price: 50000,
                image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
                size: 'Nhỏ',
                variant: 'Chân trâu trắng',
                note: 'không đá'
            },
            {
                productId: 'P002',
                name: 'Trà chân châu',
                quantity: 1,
                price: 15000,
                image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
                size: 'Trung Bình',
                variant: 'Chân châu',
                note: 'đá vừa'
            },
        ],
        customer: {
            name: 'Nguyễn Văn A',
            address: '123 Đường ABC, Quận 1, TP.HCM',
            phone: '0123456789',
        },
        paymentMethod: 'Momo',
        totalAmount: 250000,
    },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    tabView: {
        width: '100%',
        backgroundColor: colors.grayBg,
        paddingTop: GLOBAL_KEYS.PADDING_DEFAULT,
        paddingHorizontal: 16,
    },
    orderItem: {
        backgroundColor: colors.white,
        padding: 15,
        borderStyle: 'dashed',
        borderBottomWidth: 1,
        borderColor: colors.gray400,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    orderStatus: {
        backgroundColor: colors.green200,
        paddingTop: 10,
        color: colors.primary,
        borderRadius: 6,
    },
    orderText: {
        fontSize: 16,
    },
    orderDetailContainer: {
        backgroundColor: colors.white,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: colors.gray700
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 6,
    },
    productInfo: {
        flex: 1,
        marginLeft: 10,
    },
    productName: {
        fontWeight: '500',
    },
    productDetails: {
        color: colors.gray700,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    },
    totalAmount: {
        marginTop: 10,
        fontWeight: 'bold',
        color: colors.primary,
    },
    date: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        alignItems: 'center',
        padding: 4,
        marginVertical: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    customerName: {
        fontWeight: '500',
        marginLeft: 10,
    },
    phoneButton: {
        backgroundColor: colors.gray200,
        padding: 4,
        borderRadius: 16,
        marginLeft: 'auto',
    },
    customerAddress: {
        marginLeft: 20,
        color: colors.gray700,
    },
    paymentHeader: {
        color: colors.primary,
        fontWeight: '700',
    },
});

export default HomeScreen;
