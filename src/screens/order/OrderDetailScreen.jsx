import React from 'react';
import { FlatList, TouchableOpacity , Pressable, ScrollView, StyleSheet, Text, View, } from 'react-native';
import { Icon } from 'react-native-paper';
import { Send2, Call } from 'iconsax-react-native';
import { DualTextRow, HorizontalProductItem, PaymentMethodRow, NormalHeader, LightStatusBar, PrimaryButton, StoreAddress, } from '../../components';
import { GLOBAL_KEYS, colors } from '../../constants';
import { AuthGraph } from '../../layouts/graphs';

const OrderDetailScreen = (props) => {

    const { navigation } = props;


    return (

        <View style={styles.container}>
            <LightStatusBar />
            <NormalHeader
                title='Chi tiết đơn hàng'
                onLeftPress={() => navigation.goBack()}
                enableLeftIcon={true}
            />




            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.containerContent}
            >
                <StoreAddress title='Quận 12' style={{ paddingHorizontal: 0 }}>
                    <OderInfo/>
                    <RecipientInfo 
                        onChatPress={() => navigation.navigate(AuthGraph.ChatWithUser)}
                        onPhonePress={() => navigation.navigate(AuthGraph.CallWithUser)}          
                    />
                    
                    <ProductsInfo />


                    <PaymentDetails />
                    <TimeOrder />
                    <PrimaryButton title="Xác thực đơn hàng" onPress={() => navigation.navigate(AuthGraph.DeliveryMapScreen)} />
                </StoreAddress>
            </ScrollView>




        </View>


    );
};

const OderInfo = () => {
    return (
        <View style={[styles.areaContainer, { borderBottomWidth: 0 }]}>
            <TouchableOpacity style={styles.orderItem} onPress={() => handleOrderPress(item.orderId)}>
                <View style={{ flex: 2 }}>
                    <Text style={styles.orderId}>Mã đơn hàng: #02312</Text>
                    <Text>Thời gian: 9:30</Text>
                </View>
                <Text style={styles.orderStatus}>Chờ xử lý</Text>
            </TouchableOpacity>
        </View>
    )
}

const orders = [
    { id: 1, status: 'Chờ xử lý', orderId: '02312', time: '9:30' },
    { id: 2, status: 'Đang xử lý', orderId: '02313', time: '10:00' },
    { id: 3, status: 'Hoàn tất', orderId: '02314', time: '12:30' },
    { id: 4, status: 'Hủy', orderId: '02315', time: '15:30' },
    { id: 5, status: 'Chờ xử lý', orderId: '02316', time: '19:00' },
];

const ProductsInfo = () => {
    return (
        <View style={[styles.areaContainer, { borderBottomWidth: 0 }]}>
            <Title
                title={'Danh sách sản phẩm'}
                icon='sticker-text-outline'
            />
            <FlatList
                data={products}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <HorizontalProductItem item={item} />
                )}
                contentContainerStyle={styles.flatListContentContainer}
                scrollEnabled={false}
            />
        </View>
    )
}

const RecipientInfo = ({onChatPress, onPhonePress}) => (
    <View>
        <View style={[styles.infoRow, {justifyContent: 'space-between'}]}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <Icon source='account' size={24} color={colors.primary} />
                <Text style={styles.customerName}>Nguyễn Văn A</Text>
            </View>
            
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={onPhonePress} style={{ backgroundColor: colors.gray200, padding: 8, borderRadius: 16 }}>
                    <Call size="24" color={colors.primary} variant="Bold" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onChatPress} style={{ backgroundColor: colors.gray200, padding: 8, borderRadius: 16 }}>
                    <Send2 size="24" color={colors.primary} variant="Bold" />
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.infoRow}>
            <Icon source='map-marker' size={24} color={colors.primary} />
            <Text>Giao đến</Text>
        </View>
        <Text style={styles.customerAddress}>Trung Mỹ Tây 2a, Phường Tô Ký, Quận 12</Text>
    </View>

);


const Title = ({
    title,
    icon,
    titleStyle,
    iconColor = colors.primary,
    iconSize = GLOBAL_KEYS.ICON_SIZE_DEFAULT }) => {
    return (
        <View style={styles.titleContainer}>
            {
                icon &&
                <Icon
                    source={icon}
                    color={iconColor}
                    size={iconSize}
                />
            }

            <Text style={[styles.greenText, titleStyle]}>{title}</Text>
        </View>

    )
}


const PaymentDetails = () => (
    <View style={{ marginBottom: 8 }}>

        <DualTextRow
            leftText="CHI TIẾT THANH TOÁN"
            leftTextStyle={{ color: colors.primary, fontWeight: 'bold' }}
        />
        <OrderId />
        {[
            { leftText: 'Tạm tính (2 sản phẩm)', rightText: '69.000đ' },
            { leftText: 'Phí giao hàng', rightText: '18.000đ' },
            { leftText: 'Giảm giá', rightText: '-28.000đ', rightTextStyle: { color: colors.primary } },
            {
                leftText: 'Đã thanh toán',
                rightText: '68.000đ',
                leftTextStyle: { paddingHorizontal: 4, paddingVertical: 2, borderWidth: 1, borderRadius: 6, borderColor: colors.primary, color: colors.primary },
                rightTextStyle: { fontWeight: '700', color: colors.primary }
            },
            { leftText: 'Thời gian đặt hàng', rightText: '2024/07/03, 20:08' },
        ].map((item, index) => (
            <DualTextRow key={index} {...item} />
        ))}



        <PaymentMethodRow enableChange={false} />
    </View>
);

const TimeOrder = ({ time }) => (
    <View style={{ backgroundColor: colors.green200, borderRadius: 6, padding: 10, marginVertical: 10 }}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <View>
                <Text style={{ color: colors.primary, fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER }}>Đơn hẹn giờ</Text>
                <Text style={{ color: colors.primary, fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT }}>Hôm nay</Text>
                <Text style={{ color: colors.primary , fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT }}>{time},Tue 12/02/2025</Text>
                
            </View>
            <View style={{ borderWidth: 1, borderRadius: 6, borderColor: colors.gray700, backgroundColor: colors.white, alignItems: 'center', padding: 10, borderStyle: 'dashed', }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon source='clock-time-three-outline' size={24} color={colors.primary} />
                    <Text style={{ color: colors.primary, fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER}}>Còn lại</Text>
                </View>
                <Text style={{ color: colors.primary, fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500' }}>1:04h</Text>
            </View>
        </View>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' , paddingTop: GLOBAL_KEYS.PADDING_SMALL, alignItems: 'center'}}>
            <Text style={{ color: colors.primary , fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER }}>Cập nhật trạng thái</Text>
            <TouchableOpacity style={{ justifyContent: 'space-between', flexDirection: 'row' , alignItems: 'center', backgroundColor: colors.white, borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT, padding: 2}}>
                <Text style={{ color: colors.primary , fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT }}>Lựa chọn</Text>
                <Icon source='chevron-down' size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>

    </View>
)

const OrderId = () => {
    return (
        <View style={[styles.row, { marginBottom: 6 }]}>
            <Text style={styles.normalText}>Mã đơn hàng</Text>
            <Pressable style={styles.row} onPress={() => { }}>

                <Text style={[styles.normalText, { fontWeight: 'bold', marginRight: 8 }]}>202407032008350</Text>
                <Icon
                    source='content-copy'
                    color={colors.teal900}
                    size={18}
                />
            </Pressable>
        </View>
    )
}



const products = [
    {
        id: '1',
        name: 'Trà Xanh Sữa Hạnh Nhân (Latte)',
        image: require('../../assets/images/product1.png'),
        price: 69000,
    },
    {
        id: '2',
        name: 'Combo 3 Olong Tea',
        image: require('../../assets/images/product1.png'),
        price: 79000,
    },
    {
        id: '3',
        name: 'Combo 2 Trà Sữa Trân Châu Hoàng Kim',
        image: require('../../assets/images/product1.png'),
        price: 69000,
    },
    {
        id: '4',
        name: 'Trà Xanh Sữa Hạnh Nhân (Latte)',
        image: require('../../assets/images/product1.png'),
        price: 79000,
    },
];



const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1
    },
    containerContent: {
        backgroundColor: colors.white,
        flex: 1,
        gap: 12,
        margin: GLOBAL_KEYS.PADDING_DEFAULT,

    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    normalText: {
        textAlign: 'justify',
        lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black
    },

    flatListContentContainer: {
        marginVertical: GLOBAL_KEYS.PADDING_DEFAULT
    },
    greenText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.primary,
        fontWeight: '600'
    },
    titleContainer: {
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: GLOBAL_KEYS.GAP_SMALL
    },
    areaContainer: {
        borderBottomWidth: 5,
        borderColor: colors.gray200,
        paddingVertical: 8
    },
    button: {
        backgroundColor: colors.white,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.gray200,
        borderWidth: 2,
        marginVertical: 16
    },
    orderItem: {
        backgroundColor: colors.white,
        paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
        borderStyle: 'dashed',
        borderBottomWidth: 1,
        borderColor: colors.gray400,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderId: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
        fontWeight: 'bold',
    },
    orderStatus: {
        flex: 1,
        borderRadius: 6,
        fontWeight: '500',
        textAlign: 'center',
        height: 20,
        backgroundColor: colors.green200, 
        color: colors.orange700,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        gap: GLOBAL_KEYS.GAP_SMALL
    },
    customerName: {
        fontWeight: '500',
       
    },
    phoneButton: {
        backgroundColor: colors.gray200,
        padding: 4,
        borderRadius: 16,
        marginLeft: 'auto',
    },
    customerAddress: {
        marginLeft: 30,
        color: colors.gray700,
    },

});

export default OrderDetailScreen;

