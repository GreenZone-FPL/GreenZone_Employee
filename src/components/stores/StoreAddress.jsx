import React, { Children } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import { Icon } from 'react-native-paper'
import PropTypes from 'prop-types'


const StoreAddressPropTypes = {
  title: PropTypes.string.isRequired,
  phoneIcon: PropTypes.string,
  adresstIcon: PropTypes.string,
  onPhonePress: PropTypes.func,
  onAdressPress: PropTypes.func,
  phoneIconColor: PropTypes.string,
  adressIconColor: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
};

export const  StoreAddress = ({
  title = 'Default Title',
  onPhonePress,
  onAdressPress,
  phoneIcon='phone',
  adresstIcon='send',
  phoneIconColor=colors.primary,
  adressIconColor=colors.primary,
  children,
  style
}) => {
  return (
    <View style={{backgroundColor: colors.white}}>
        <View style={[styles.header, style]}>
        <Text style={styles.title}>Green zone - {title}</Text>
        <View style={{flexDirection:'row', gap: 10}}>
            <TouchableOpacity onPress={onPhonePress} style={{backgroundColor: colors.gray200, padding: 4, borderRadius: 16}}>
                <Icon source={phoneIcon} size={24} color={phoneIconColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onAdressPress} style={{backgroundColor: colors.gray200, padding: 4, borderRadius: 16}}>
                <Icon source={adresstIcon} size={24} color={adressIconColor} />
            </TouchableOpacity>
        </View>
        </View>
        <View>{children}</View>
    </View>
  );
};


StoreAddress.propTypes = StoreAddressPropTypes;


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderColor: colors.gray300,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    color: colors.black,
    flex: 1,
  },
});


