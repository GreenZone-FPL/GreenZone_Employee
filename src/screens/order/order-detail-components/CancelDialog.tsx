import React from 'react';
import { StyleSheet, TextInput, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import {
  Column,
  DialogBasic,
  NormalLoading,
  NormalText,
  PrimaryButton,
  Row,
  LabelInput
} from '../../../components';

import { colors, GLOBAL_KEYS } from '../../../constants';
import { useCancelDialogContainer } from '../../../containers';

interface CancelDialogProps {
  visible: boolean;
  onHide: () => void;
  orderId: string;
  shipperId: string;
  callBack: () => Promise<void>;
}

export const CancelDialog: React.FC<CancelDialogProps> = ({
  visible,
  onHide,
  orderId,
  callBack,
}) => {
  const {
    cancelReasons,
    customReason,
    selectedReason,
    error,
    loading,
    setError,
    setSelectedReason,
    onConfirm,
    handleCustomReasonChange,
  } = useCancelDialogContainer(orderId, onHide, callBack);

  const MAX_REASON_LENGTH = 100;

  const handleChangeReason = (text: string) => {
    if (text.length <= MAX_REASON_LENGTH) {
      handleCustomReasonChange(text);
      setError(false);
    }
  };

  return (
    <DialogBasic visible={visible} onHide={onHide} title="Chọn lý do Hủy">
      <NormalLoading visible={loading} />

      <RadioButton.Group
        onValueChange={value => {
          setSelectedReason(value);
          setError(false);
        }}
        value={selectedReason}
      >
        <Column>
          {cancelReasons.map((reason: string, index: number) => (
            <Row key={index}>
              <RadioButton value={reason} color={colors.primary} />
              <NormalText text={reason} />
            </Row>
          ))}

          {selectedReason === 'Lý do khác' && (
            <>
              <LabelInput label="Nhập lý do của bạn" required />
              <TextInput
                value={customReason}
                onChangeText={handleChangeReason}
                style={styles.input}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Ví dụ: Khách đổi ý"
              />
              <Text style={styles.charCount}>
                {customReason.length}/{MAX_REASON_LENGTH} ký tự
              </Text>

              {error && (
                <NormalText
                  text={
                    customReason.length > MAX_REASON_LENGTH
                      ? 'Lý do không được vượt quá 100 ký tự'
                      : 'Vui lòng nhập lý do cụ thể'
                  }
                  style={styles.errorText}
                />
              )}
            </>
          )}
        </Column>
      </RadioButton.Group>

      <PrimaryButton
        onPress={onConfirm}
        title={'Đồng ý'}
        style={styles.button}
      />
    </DialogBasic>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    padding: 12,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    height: 100,
    backgroundColor: '#fff',
  },
  charCount: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 4,
    fontSize: 12,
    color: colors.gray700,
  },
  errorText: {
    color: colors.invalid,
  },
  button: {
    backgroundColor: colors.orange700,
    borderColor: colors.orange700,
    marginTop: 16,
  },
});
