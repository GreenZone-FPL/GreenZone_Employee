import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Column, DialogBasic, LabelInput, NormalLoading, NormalText, PrimaryButton, Row } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { useCancelDialogContainer } from '../../../containers/useCancelDialogContainer';



interface CancelDialogProps {
  visible: boolean;
  onHide: () => void;
  orderId: string,
  shipperId: string,
  callBack: () => Promise<void>
}

export const CancelDialog: React.FC<CancelDialogProps> = ({ visible, onHide, orderId, callBack }) => {
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
  } = useCancelDialogContainer(orderId, onHide, callBack)

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
            <Row key={index} >
              <RadioButton value={reason} color={colors.primary} />
              <NormalText text={reason} />
            </Row>
          ))}

          {selectedReason === 'Lý do khác' && (
            <>
              <LabelInput label="Nhập lý do của bạn" required />
              <TextInput
                value={customReason}
                onChangeText={handleCustomReasonChange}
                style={styles.input}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Ví dụ: Khách đổi ý"
              />
              {error && (
                <NormalText
                  text="Vui lòng nhập lý do cụ thể"
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
        disabled={loading}
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
  errorText: {
    color: colors.invalid,
  },
  button: {
    backgroundColor: colors.orange700,
    borderColor: colors.orange700,
    marginTop: 16,
  },
});
