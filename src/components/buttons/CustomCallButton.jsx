import { Pressable, StyleSheet } from 'react-native';
import ZegoUIKitPrebuiltCallInvitation from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { Icon } from 'react-native-paper';
import { colors } from '../../constants';
import { Toaster } from '../../utils';


export const CustomCallButton = ({ consigneePhone, consigneeName, navigation }) => {
    const handleCallPress = async () => {
        try {
            const result = await ZegoUIKitPrebuiltCallInvitation.sendCallInvitation(
                [ // invitees
                    {
                        userID: consigneePhone,
                        userName: consigneeName,
                    },
                ],
                false, // show waiting page
                navigation,
                {
                    resourceID: 'zegouikit_call', // Thêm resourceID vào đây
                    showWaitingPageWhenGroupCall: true,
                }
            );
            console.log('📞 Call result:', result);

        } catch (err) {
            if (err === 6000281) {
                Toaster.show('Đây là đơn hàng ảo. Không thể gọi')
            } else {
                Toaster.show(err || err.message)
            }
        }
    };

    return (
        <Pressable style={styles.iconButton} onPress={handleCallPress}>
            <Icon
                source="phone"
                color={colors.blue600}
                size={20}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    iconButton: {
        padding: 11,
        borderRadius: 24,
        backgroundColor: colors.fbBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8

    }
})

