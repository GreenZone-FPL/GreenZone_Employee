import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import {colors} from '../../constants';
import {AppGraph} from '../../layouts/graphs';
import {Toaster} from '../../utils/toaster';

const VerifyOTPScreen = ({route, navigation}) => {
  const {phoneNumber} = route.params;
  const [code, setCode] = useState('');

  const handleVerifyOTP = async () => {
    if (code.length !== 6) {
      Toaster.show('Vui lòng nhập mã OTP gồm 6 chữ số.');
      return;
    } else {
      navigation.navigate(AppGraph.MAIN);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực OTP</Text>
      <Text style={styles.subtitle}>Nhập mã OTP gửi đến {phoneNumber}</Text>

      <OtpInput
        focusColor={colors.primary}
        autoFocus={true}
        secureTextEntry={false}
        numberOfDigits={6}
        onTextChange={setCode}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.fbBg,
    gap: 20,
  },
  title: {fontSize: 28, fontWeight: 'bold', color: colors.black},
  subtitle: {fontSize: 14, color: colors.gray850},
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    width: '80%',
  },
  buttonText: {color: colors.white, fontSize: 16, textAlign: 'center'},
});

export default VerifyOTPScreen;
