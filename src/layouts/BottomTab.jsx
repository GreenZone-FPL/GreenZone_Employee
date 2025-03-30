import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import HomeScreen from '../screens/bottom-navs/HomeScreen';
import ProfileScreen from '../screens/bottom-navs/ProfileScreen';
import { colors, GLOBAL_KEYS } from '../constants';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
    return (
        <Tab.Navigator
            initialRouteName="HomeScreen"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.gray700,
                tabBarStyle: {
                    backgroundColor: colors.white,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
                    fontWeight: '500',
                },
                tabBarIcon: ({ color }) => {
                    const iconSize = 30;
                    let iconName = '';
                    if (route.name === 'HomeScreen') {
                        iconName = 'clipboard-list';
                    } else if (route.name === 'ProfileScreen') {
                        iconName = 'account-circle';
                    }
                    return <Icon source={iconName} color={color} size={iconSize} />;
                },
            })}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
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