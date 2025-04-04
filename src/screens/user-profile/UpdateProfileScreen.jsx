import React from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Icon } from 'react-native-paper';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';
import {
  DialogBasic,
  NormalHeader,
  NormalInput,
  NormalLoading,
  NormalText,
  OverlayStatusBar,
  PrimaryButton,
} from '../../components';
import LabelInput from '../../components/inputs/LabelInput';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useUpdateProfileContainer } from '../../containers';

const { width } = Dimensions.get('window');

const UpdateProfileScreen = ({ navigation, route }) => {
  const { profile } = route.params;
  const defaultStyles = useDefaultStyles();

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    dob,
    setDob,
    gender,
    setGender,
    avatar,
    loading,
    setIsFocus,
    open,
    setOpen,
    selectedImages,
    isImagePickerVisible,
    setImagePickerVisible,
    lastNameMessage,
    setLastNameMessage,
    openCamera,
    openImageLibrary,
    handleUpdateProfile,
    genderOptions
  } = useUpdateProfileContainer(profile)

  return (
    <KeyboardAvoidingView style={styles.container}>
      <NormalLoading visible={loading} />
      <ScrollView>
        <NormalHeader
          title="Cập nhật thông tin"
          enableLeftIcon
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Image
              style={styles.avatarImage}
              source={{
                uri:
                  selectedImages[0] ||
                  avatar ||
                  'https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg',
              }}
            />
            <TouchableOpacity
              style={styles.cameraIconContainer}
              onPress={() => setImagePickerVisible(true)}>
              <Icon size={16} color={colors.primary} source={'camera'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formContainer}>
          <NormalInput
            label="Họ"
            value={firstName}
            setValue={setFirstName}
          />
          <NormalInput
            label="Tên"
            value={lastName}
            setValue={(value) => {
              setLastName(value)
              if (lastNameMessage) {
                setLastNameMessage('')
              }

            }}
            invalidMessage={lastNameMessage}
            required
          />



          <LabelInput label="Ngày sinh" style={{ fontSize: 14 }} />
          <Pressable
            style={styles.dropdown}
            onPress={() => setOpen(true)}
          >
            <NormalText text={dob.toLocaleDateString('vi-VN')} style={{ fontSize: 14 }} />
          </Pressable>







          <LabelInput label='Giới tính' style={{ fontSize: 14 }} />
          <Dropdown
            data={genderOptions}
            labelField="label"
            valueField="value"
            value={gender}
            placeholder="Chọn giới tính"
            placeholderStyle={styles.placeholderText}
            style={styles.dropdown}
            selectedTextStyle={styles.placeholderText}
            selectedTextProps={styles.placeholderText}
            itemTextStyle={styles.placeholderText}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setGender(item.value);
              setIsFocus(false);
            }}
          />

          <PrimaryButton
            style={{ backgroundColor: (loading || !!lastNameMessage) ? colors.disabledBg : colors.primary }}
            disabled={loading || !!lastNameMessage}
            title="Cập nhật tài khoản"
            onPress={() => {}}
          />

          <DialogBasic isVisible={open} onHide={() => setOpen(false)} title={'Lịch'}>

            <DateTimePicker
              mode="single"
              locale="vi"
              date={dob}
              onChange={({ date }) => {
                setDob(date)
                setOpen(false)
              }}
              maxDate={new Date()}

              styles={defaultStyles}
            />
          </DialogBasic>


          <Modal
            visible={isImagePickerVisible}
            animationType="slide"
            transparent={true}>
            <Pressable style={styles.imagePickerOverlay} onPress={() => setImagePickerVisible(false)}>
              <OverlayStatusBar />
              <View style={styles.imagePickerContainer} >
                <TouchableOpacity style={styles.option} onPress={openCamera}>
                  <NormalText text="Chụp ảnh mới" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.option}
                  onPress={openImageLibrary}>
                  <NormalText text="Chọn ảnh từ thư viện" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => setImagePickerVisible(false)}>
                  <NormalText text="Hủy bỏ" />
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>



        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    gap: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  avatar: {
    backgroundColor: colors.gray700,
    position: 'relative',
    width: width / 3,
    height: width / 3,
    borderRadius: width / 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    resizeMode: 'contain',
  },
  cameraIconContainer: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    end: 0,
    bottom: 0,
    margin: GLOBAL_KEYS.PADDING_SMALL,
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    borderRadius: GLOBAL_KEYS.ICON_SIZE_DEFAULT / 2,
    padding: 4,
  },
 
  formContainer: {
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 14
  },

  placeholderText: {
    color: colors.black,
    fontSize: 14,
  },
  imagePickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  imagePickerContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  option: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
});

export default UpdateProfileScreen;
