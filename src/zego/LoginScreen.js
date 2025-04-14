import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirstInstallTime } from 'react-native-device-info'

import KeyCenter from '../../KeyCenter';
import { onUserLoginZego } from './common';

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Step 2: Call "ZegoUIKitPrebuiltCallService.init" method after the user login.
export default function LoginScreen(props) {
    const navigation = useNavigation();
    const [userId, setUserId] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoginBtnDisable, setLoginBtnDisable] = useState(false);
    const [loginBtnTitle, setLoginBtnTitle] = useState('Login');
  
    const storeUserInfo = async (info) => {
      await AsyncStorage.setItem("userId", info.userID)
      await AsyncStorage.setItem("lastName", info.lastName) // key vẫn là "userName" nếu app yêu cầu, nhưng giá trị là lastName
    }

    const loginHandler = () => {
      setLoginBtnDisable(true)
      setLoginBtnTitle('Logging in...')
  
      // Store user info to auto login
      storeUserInfo({ userId, lastName })
  
      // Init the call service
      onUserLoginZego(userId, lastName, props)
      .then(() => {
        // Jump to HomeScreen to make new call
        navigation.navigate('InviteCallScreen', { userId });
      })
      .finally(() => {
        setLoginBtnDisable(false);
        setLoginBtnTitle('Login')
      });
    }
  
    useEffect(() => {
      getFirstInstallTime().then(firstInstallTime => {
        const id = String(firstInstallTime).slice(-5);
        setUserId(id);
        const name = 'user_' + id
        setLastName(name);
      });
    }, [])
  
    return <View style={styles.container}>
      <View style={{ marginBottom: 30 }}>
        <Text>appID: {KeyCenter.appID}</Text>
        <Text>userId: {userId}</Text>
        <Text>lastName: {lastName}</Text>
      </View>
      <View style={{ width: 160 }}>
        <Button
          title={loginBtnTitle}
          disabled={isLoginBtnDisable}
          onPress={loginHandler}
        />
      </View>
    </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A3A3A3'
  },
})
