import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { CustomTabView, LightStatusBar, NormalHeader, NormalText } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';


const OrderHistoryScreen = (props) => {
    const { navigation } = props;
    const [tabIndex, setTabIndex] = useState(0);

    return (
      <View style={styles.container}>
        <LightStatusBar />
        <NormalHeader
          title="Đơn hàng"
          onLeftPress={() => navigation.goBack()}
        />

        <CustomTabView
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          tabBarConfig={{
            titles: ['Đơn Mới', 'Hoàn tất', 'Giao Thất Bại'],
            titleActiveColor: colors.primary,
            titleInActiveColor: colors.gray700,
            scrollable: true,
            containerStyle: {backgroundColor: colors.white},
          }}>
          <View>
            <NormalText text="Đơn Mới" />
          </View>
          <View>
            <NormalText text="Hoàn tất" />
          </View>
          <View>
            <NormalText text="Giao Thất Bại" />
          </View>
        </CustomTabView>
      </View>
    );
};

// Component trống
const EmptyView = ({ message }) => (
    <View style={styles.emptyContainer}>
        <Image
            style={styles.image}
            resizeMode="cover"
            source={require('../../assets/images/logo.png')}
        />
        <Text>{message}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    scene: {
        width: '100%',
        backgroundColor: colors.grayBg,
        paddingTop: GLOBAL_KEYS.PADDING_DEFAULT,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OrderHistoryScreen;