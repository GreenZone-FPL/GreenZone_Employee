import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {GLOBAL_KEYS, colors} from '../../constants';

// PropTypes cho FlatInput
const FlatInputPropTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  message: PropTypes.string,
  setIsPasswordVisible: PropTypes.func, // Có thể không truyền, tránh lỗi
  isPasswordVisible: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  style: PropTypes.object,
  editable: PropTypes.bool,
  keyboardType: PropTypes.oneOf([
    'default',
    'number-pad',
    'decimal-pad',
    'numeric',
    'email-address',
    'phone-pad',
    'url',
  ]),
};

// 🔹 `FlatInput` đã sửa lỗi
export const FlatInput = ({
  label = 'Default label',
  placeholder = 'Default placeholder',
  value,
  setValue,
  message = '',
  setIsPasswordVisible = () => {}, // Giá trị mặc định tránh lỗi
  isPasswordVisible = false,
  secureTextEntry = false,
  style,
  editable = true,
  keyboardType = 'default',
  onSubmitEditing,
  returnKeyType = 'done',
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={setValue}
        mode="flat"
        placeholder={placeholder}
        placeholderTextColor={colors.gray400}
        error={!!message}
        outlineColor={message ? colors.red800 : colors.primary}
        activeUnderlineColor={colors.primary}
        underlineColor={colors.primary}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        style={styles.input}
        right={
          secureTextEntry && (
            <TextInput.Icon
              color={colors.gray400}
              icon={isPasswordVisible ? 'eye-off' : 'eye'}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            />
          )
        }
        editable={editable}
        keyboardType={keyboardType}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
      />
      {message ? <Text style={styles.errorText}>{message}</Text> : null}
    </View>
  );
};

FlatInput.propTypes = FlatInputPropTypes;

// 🔹 `CustomFlatInput` đã sửa lỗi
export const CustomFlatInput = ({
  label = 'Default label',
  placeholder = 'Default placeholder',
  value,
  setValue,
  message = '',
  rightIcon = 'calendar',
  onRightPress = () => {}, // Tránh lỗi khi không truyền
  rightIconColor = colors.primary,
  style,
  editable = true,
  keyboardType = 'default',
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={setValue}
        mode="flat"
        placeholder={placeholder}
        placeholderTextColor={colors.gray400}
        error={!!message}
        outlineColor={message ? colors.red800 : colors.primary}
        activeUnderlineColor={colors.primary}
        underlineColor={colors.primary}
        style={styles.input}
        right={
          <TextInput.Icon
            color={rightIconColor}
            icon={rightIcon}
            onPress={onRightPress}
          />
        }
        editable={editable}
        keyboardType={keyboardType}
      />
      {message ? <Text style={styles.errorText}>{message}</Text> : null}
    </View>
  );
};

CustomFlatInput.propTypes = {
  ...FlatInputPropTypes,
  rightIcon: PropTypes.string,
  onRightPress: PropTypes.func,
  rightIconColor: PropTypes.string,
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    backgroundColor: colors.white,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  errorText: {
    color: colors.red900,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    marginTop: 4,
  },
});
