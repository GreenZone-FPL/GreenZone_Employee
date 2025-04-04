import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GLOBAL_KEYS, colors} from '../../constants';

const NormalTextPropTypes = {
  text: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export const NormalText = ({text = 'Normal text', style}) => {
  return (
    <View>
      <Text style={[styles.text, ...(Array.isArray(style) ? style : [style])]}>
        {text}
      </Text>
    </View>
  );
};

NormalText.propTypes = NormalTextPropTypes;

const styles = StyleSheet.create({
  text: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
});
