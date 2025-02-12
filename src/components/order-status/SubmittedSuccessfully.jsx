import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {colors, GLOBAL_KEYS} from '../../constants';

const {width, height} = Dimensions.get('window');

const SubmittedSuccessfully = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../assets/images/order/submitted.png')}
      />
      <Text style={styles.title}>
        Your application is submitted successfully
      </Text>
      <Text style={styles.subtitle}>
        Please wait and check your application status under My Application
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Okay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    gap: 31,
  },
  image: {
    width: 135,
    height: 135,
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    width: '70%',
  },
  subtitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '400',
    textAlign: 'center',
    width: '70%',
    color: '#595959',
  },
  button: {
    borderRadius: 112,
    borderWidth: 1,
    borderColor: colors.primary,
    width: 231,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default SubmittedSuccessfully;
