import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { HorizontalProductItem } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { Title } from './Title';

export const ProductsInfo = ({ orderItems }) => {
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
    areaContainer: {
        backgroundColor: colors.white,
        paddingVertical: 12,
        marginBottom: 5,
    },
    flatListContentContainer: {
        gap: 5,
        backgroundColor: colors.fbBg,
    },
})