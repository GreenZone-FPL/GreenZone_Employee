import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { TickCircle } from 'iconsax-react-native';
import { colors, GLOBAL_KEYS } from '../../constants';
import { BottomGraph } from '../../layouts/graphs';

const OrderDoneScreen = (props) => {

    const navigation = props.navigation;
  return (
    <View style={styles.container}>
      <TickCircle size={80} color='#2E7D32' variant='Bold' style={styles.checkIcon} />
      <Text style={styles.title}>Bạn đã đến nơi cần được giao hàng</Text>
      <Text style={styles.subtitle}>Hãy kiểm tra lại đơn hàng trước khi giao đến khách hàng</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(BottomGraph.HomeScreen)}>
        <Text style={styles.buttonText}>Hoàn tất</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderDoneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  checkIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
  },
});