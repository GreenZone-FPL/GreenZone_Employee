import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Icon } from 'react-native-paper';
import { colors } from '../constants';
import OrderHistoryScreen from '../screens/bottom-navs/OrderHistoryScreen';
import ProfileScreen from '../screens/bottom-navs/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
    return (
        <Tab.Navigator
            initialRouteName="OrderHistoryScreen"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.gray700,
                tabBarStyle: {
                    backgroundColor: colors.white,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                tabBarIcon: ({ color }) => {
                    const iconSize = 30;
                    let iconName = '';
                    if (route.name === 'OrderHistoryScreen') {
                        iconName = 'clipboard-list';
                    } else if (route.name === 'ProfileScreen') {
                        iconName = 'account-circle';
                    }
                    return <Icon source={iconName} color={color} size={iconSize} />;
                },
            })}>
            <Tab.Screen
                name="OrderHistoryScreen"
                component={OrderHistoryScreen}
                options={{ tabBarLabel: 'Đơn hàng' }}
            />
            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ tabBarLabel: 'Cá nhân' }}
            />

        </Tab.Navigator>

    );
};

export default BottomTab;