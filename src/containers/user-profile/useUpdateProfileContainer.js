import { useEffect, useState } from "react";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { updateUserProfile, uploadFile } from "../../axios";
import { AppAsyncStorage, Toaster } from "../../utils";
export const useUpdateProfileContainer = (profile) => {
    const [lastName, setLastName] = useState('');
    const [lastNameMessage, setLastNameMessage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [dob, setDob] = useState(new Date());
    const [gender, setGender] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isImagePickerVisible, setImagePickerVisible] = useState(false);
    const [avatar, setAvatar] = useState('');
    const [hasImageChanged, setHasImageChanged] = useState(false); // biến cờ mới


    useEffect(() => {
        setLastName(profile.lastName || '');
        setFirstName(profile.firstName || '');
        setDob(profile.dateOfBirth ? new Date(profile.dateOfBirth) : new Date());
        setGender(
            profile.gender === 'male'
                ? 'Nam'
                : profile.gender === 'female'
                    ? 'Nữ'
                    : profile.gender === 'other'
                        ? 'Khác'
                        : '',
        );
        setAvatar(profile.avatar || '');
        setSelectedImages([]);
        setHasImageChanged(false);
    }, []);

    const genderOptions = [
        { label: 'Nam', value: 'Nam' },
        { label: 'Nữ', value: 'Nữ' },
        { label: 'Khác', value: 'Khác' },
    ];

    const openCamera = () => {
        const options = { saveToPhotos: true, mediaType: 'photo' };
        launchCamera(options, response => {
            if (response.didCancel || response.errorCode) return;
            const newImage = response?.assets[0]?.uri;
            if (newImage && newImage !== avatar) {
                setSelectedImages([newImage]);
                setHasImageChanged(true);
            }
        });
        setImagePickerVisible(false);
    };

    const openImageLibrary = () => {
        const options = { mediaType: 'photo', selectionLimit: 1 };
        launchImageLibrary(options, response => {
            if (response.didCancel || response.errorCode) return;
            const newImage = response.assets?.[0]?.uri;
            if (newImage && newImage !== avatar) {
                setSelectedImages([newImage]);
                setHasImageChanged(true);
            }
        });
        setImagePickerVisible(false);
    };


    const handleUpdateProfile = async () => {
        if (!lastName.trim()) {
            setLastNameMessage('Trường này không được để trống')
            return;
        }

        const formattedDob = dob.toISOString().split('T')[0];
        const formattedGender =
            gender === 'Nam' ? 'male' : gender === 'Nữ' ? 'female' : 'other';

        try {
            setLoading(true);
            let avatarUrl = avatar || '';
            if (hasImageChanged && selectedImages.length > 0) {
                const uploadedUrl = await uploadFile(selectedImages[0]);
                if (uploadedUrl) {
                    avatarUrl = uploadedUrl;
                }
            }

            const profileData = {
                firstName,
                lastName,
                dateOfBirth: formattedDob,
                gender: formattedGender,
                avatar: avatarUrl,
            };

            console.log('Dữ liệu gửi lên API:', profileData);

            const result = await updateUserProfile(profileData);

            if (result?._id) {
                setHasImageChanged(false);
                await AppAsyncStorage.storeData(
                    AppAsyncStorage.STORAGE_KEYS.user,
                    result,
                );
               
              
                Toaster.show('Cập nhật thành công!')
            }
        } catch (error) {
            console.log('Error', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        firstName,
        setFirstName,
        lastName,
        setLastName,
        dob,
        setDob,
        gender,
        setGender,
        avatar, 
        setAvatar,
        loading,
        setLoading, 
        isFocus,
        setIsFocus,
        open,
        setOpen,
        selectedImages,
        setSelectedImages,
        isImagePickerVisible,
        setImagePickerVisible,
        hasImageChanged,
        setHasImageChanged,
        lastNameMessage,
        setLastNameMessage,
        openCamera,
        openImageLibrary,
        handleUpdateProfile,
        genderOptions
    }
}