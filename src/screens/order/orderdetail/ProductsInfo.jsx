import { StyleSheet, Text, View, FlatList } from 'react-native'
import { HorizontalProductItem } from '../../../components';
import { colors } from '../../../constants';
import React from 'react'
import { Icon } from 'react-native-paper';


const Title = ({
    title,
    icon,
    titleStyle,
    iconColor = colors.primary,
    iconSize = GLOBAL_KEYS.ICON_SIZE_DEFAULT,
}) => {
    return (
        <View style={styles.titleContainer}>
            {icon && <Icon source={icon} color={iconColor} size={iconSize} />}

            <Text style={[styles.greenText, titleStyle]}>{title}</Text>
        </View>
    );
};


const ProductsInfo = ({ orderItems }) => {
    return (
        <View style={[styles.areaContainer, { borderBottomWidth: 0 }]}>
            <View style={{ marginHorizontal: 16 }}>
                <Title title={'Danh sách sản phẩm'} icon="clipboard-list" />
            </View>

            <FlatList
                data={orderItems}
                keyExtractor={item => item.product._id}
                renderItem={({ item }) => {
                    const formattedItem = {

                        productName: item.product.name,
                        image: item.product.image,
                        variantName: item.product.size,
                        price: item.price,
                        quantity: item.quantity,
                        isVariantDefault: false,
                        toppingItems: Array.isArray(item.toppingItems)
                            ? item.toppingItems
                            : [],
                    };

                    return (
                        <HorizontalProductItem
                            item={formattedItem}
                            enableAction={false}
                        />
                    );
                }}
                contentContainerStyle={styles.flatListContentContainer}
                scrollEnabled={false}
            />
        </View>
    );
};

export default ProductsInfo

const styles = StyleSheet.create({
    titleContainer: {
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: GLOBAL_KEYS.GAP_SMALL,
    },
    greenText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.primary,
        fontWeight: '600',
    },
})