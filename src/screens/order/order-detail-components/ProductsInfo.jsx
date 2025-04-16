import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Column, HorizontalProductItem } from '../../../components';
import { colors } from '../../../constants';
import { Title } from './Title';

export const ProductsInfo = ({ orderItems }) => {
    return (
        <Column style={styles.areaContainer}>
            <View style={{ marginHorizontal: 16 }}>
                <Title title={'Danh sách sản phẩm'} />
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
        </Column>
    );
};



const styles = StyleSheet.create({
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