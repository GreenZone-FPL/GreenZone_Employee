import React, {useState, useRef} from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';
import {PrimaryButton, NormalHeader} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {AppGraph} from '../../layouts/graphs';
import {View} from 'react-native-animatable';

const LoginStepTwoScreen = props => {
  const {navigation} = props;
  const [phone, setPhone] = useState('0983783558');

  return (
    <View style={styles.container}>
      <NormalHeader title="" onLeftPress={() => navigation.goBack()} />
      <Text style={styles.headerText}>Nhập mã OTP để xác thực</Text>
      <Text style={styles.subText}>
        A 6 digit OTP has been sent to your phone number + {phone}
        <Text style={styles.changeText}> Change</Text>
      </Text>
      <Text style={styles.enterOTPText}>Enter OTP Text</Text>
      <OTPView />
      <PrimaryButton
        title="Xác thực OTP"
        onPress={() => navigation.navigate(AppGraph.MAIN)}
      />
    </View>
  );
};

const OTPView = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  const handleSubmitEditing = index => {
    if (index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={inputRefs[index]}
          value={value}
          onChangeText={text => handleChangeText(text, index)}
          maxLength={1}
          keyboardType="number-pad"
          style={styles.otpInput}
          onSubmitEditing={() => handleSubmitEditing(index)}
          blurOnSubmit={false}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 18,
    fontWeight: '500',
    flexShrink: 1,
  },
  changeText: {
    color: colors.primary,
    flexShrink: 1,
  },
  enterOTPText: {
    fontSize: 18,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  otpInput: {
    width: GLOBAL_KEYS.ICON_SIZE_LARGE * 1.5,
    height: GLOBAL_KEYS.ICON_SIZE_LARGE * 1.5,
    textAlign: 'center',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderColor: colors.primary,
    fontWeight: 'bold',
    borderWidth: 1,
  },
});

export default LoginStepTwoScreen;
