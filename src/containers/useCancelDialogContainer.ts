import { useState } from "react";
import { Alert } from "react-native";
import { updateOrderStatus } from "../axios";
import { DeliveryMethod, OrderStatus } from "../constants";
import { AppAsyncStorage, Toaster } from "../utils";

export const useCancelDialogContainer = (
    orderId: string,
    onHide: () => void,
    callBack: () => Promise<void>
) => {
    const cancelReasons = [
        'Người nhận không bắt máy',
        'Người nhận bom hàng',
        'Sai địa chỉ',
        'Lý do khác'
    ];

    const [selectedReason, setSelectedReason] = useState(cancelReasons[0]);
    const [customReason, setCustomReason] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const onConfirm = async (): Promise<void> => {
        if (!selectedReason) {
            console.log('Vui lòng chọn lý do hủy!');
            return;
        }

        let reasonToSubmit: string = selectedReason;

        if (selectedReason === 'Lý do khác') {
            if (customReason.trim() === '') {
                setError(true);
                return;
            }
            reasonToSubmit = customReason.trim();
        }

        Alert.alert(
            'Xác nhận hủy đơn',
            `Bạn chắc chắn muốn hủy đơn với lý do: ${reasonToSubmit}?`,
            [
                {
                    text: 'Đóng',
                    style: 'cancel',
                },
                {
                    text: 'Đồng ý',
                    onPress: async () => {
                        try {
                            setLoading(true)
                            const merchant = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.merchant, null)
                            if (merchant) {
                                console.log('shipperId', merchant._id)
                                await updateOrderStatus(orderId, OrderStatus.FAILED_DELIVERY.value, DeliveryMethod.DELIVERY.value, merchant._id, reasonToSubmit);
                                setSelectedReason('');
                                setCustomReason('');
                                setError(false);
                                onHide(); // Đóng dialog
                                await callBack()
                            }

                        } catch (error) {
                            Toaster.show(error.message)
                        } finally {
                            setLoading(false)
                        }

                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleCustomReasonChange = (text: string) => {
        setCustomReason(text);
        if (error && text.trim() !== '') {
            setError(false);
        }
    };
    return {
        cancelReasons,
        customReason,
        selectedReason,
        error,
        loading,
        setError,
        setSelectedReason,
        onConfirm,
        handleCustomReasonChange,
    }
}