import React, { Children } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import { Send2, Call } from 'iconsax-react-native';
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
  children,
  style
}) => {
  return (
    <View style={{backgroundColor: colors.white}}>
        <View style={[styles.header, style]}>
          <Text style={styles.title}>Green zone - {title}</Text>
          <View style={{flexDirection:'row', gap: 10}}>
              <TouchableOpacity onPress={onPhonePress} style={{backgroundColor: colors.gray200, padding: 8, borderRadius: 16}}>
                <Call size="24" color={colors.primary} variant="Bold"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={onAdressPress} style={{backgroundColor: colors.gray200, padding: 8, borderRadius: 16}}>
                <Send2 size="24" color={colors.primary} variant="Bold"/>
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
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomWidth: 1,
    borderColor: colors.gray300,
    alignItems: 'center'
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
    color: colors.black,
    flex: 1,
  },
});


