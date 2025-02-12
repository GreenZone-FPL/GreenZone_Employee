import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { launchCamera } from 'react-native-image-picker';
import { Icon } from "react-native-paper";
import io from "socket.io-client";
import { Column, FlatInput, NormalHeader, NormalText, PrimaryButton, Row } from "../../components/";
import { colors, GLOBAL_KEYS } from "../../constants";

// const socket = io("https://serversocket-4oew.onrender.com/");
const socket = io("http://192.168.0.110:3000/");


const ChatWithUser = (navigation) => {

    const [userName, setUserName] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [typingStatus, setTypingStatus] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImagePickerVisible, setImagePickerVisible] = useState(false);

    useEffect(() => {
        socket.on("receive message", (data) => {
          addMessage(data.userName, data.message, data.image);
        });
    
        socket.on("user typing", (data) => {
          setTypingStatus(`${data.userName} đang soạn tin...`);
          setTimeout(() => setTypingStatus(""), 3000);
        });
    
        return () => {
          socket.off("receive message");
          socket.off("user typing");
        };
      }, []);
    
      const joinChat = () => {
        if (userName.trim()) {
          socket.emit("join", userName);
          setIsLoggedIn(true);
          setErrorMessage("");
        } else {
          setErrorMessage("Username is required!");
        }
      };
      const sendMessage = (imageUri = null) => {
        if (message.trim() || imageUri) {
          const msgData = { message, image: imageUri };
          socket.emit("send message", msgData);
          addMessage("You", message, imageUri, true);
          setMessage("");
          setSelectedImage(null);
        }
      };
    
      const addMessage = (userName, message, image = null, isYou = false) => {
        const newMessage = { userName, message, image, isYou };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };
    
      const openCamera = () => {
        const options = {
          saveToPhotos: true,
          mediaType: 'photo',
        };
        launchCamera(options, response => {
          if (response.didCancel || response.errorCode) return;
    
          setSelectedImages(prev => {
            const newImages = response?.assets[0]?.uri;
            if (prev.length < 3) {
              return [...prev, newImages];
            }
            return prev;
          });
        });
        setImagePickerVisible(false); // Hide modal
      };
    
      const pickImage = () => {
        ImagePicker.launchImageLibrary(
          { mediaType: "photo", quality: 0.8 },
          (response) => {
            if (response.didCancel) return;
            if (response.errorMessage) {
              Alert.alert("Lỗi", "Không thể chọn ảnh.");
              return;
            }
    
            const imageUri = response.assets?.[0]?.uri;
    
            if (imageUri) {
              sendMessage(imageUri); // Gửi ảnh ngay sau khi chọn
            }
          }
        );
        setImagePickerVisible(false);
      };
    
  return (
    <>
      {!isLoggedIn ? (
        <Column style={{ padding: 16 }}>
          <Text style={styles.header}>Join Chat Room</Text>
          <FlatInput label="Enter your name" placeholder="Nguyen Van A" value={userName} setValue={setUserName} message={errorMessage} />
          <PrimaryButton title="Join" onPress={joinChat} />
        </Column>
      ) : (
        <Column style={styles.chatRoom}>
          <NormalHeader style={{ backgroundColor: colors.transparent }} title="Chat room" onLeftPress={() => navigation.goBack()} />
          <Column style={{ flex: 1, paddingHorizontal: 16 }}>

            <FlatList
              data={messages}
              keyExtractor={(_, index) => index.toString()}
              renderItem={MessageItem}
              contentContainerStyle={{ flexGrow: 1, gap: 12 }} />
            <NormalText style={{ fontStyle: "italic" }} text={typingStatus} />


            <Row>
              <FlatInput
                label="Enter message"
                placeholder=""
                value={message}
                style={{ flex: 1 }}
                setValue={setMessage}
                onSubmitEditing={() => sendMessage()}
                returnKeyType="send"
              />
              <TouchableOpacity onPress={() => setImagePickerVisible(true)}>
                <Icon
                  source="image"
                  color={colors.gray850}
                  size={28}
                />
              </TouchableOpacity>

            </Row>



          </Column>
          {selectedImage && (
            <View style={styles.previewContainer}>
              <Text>Hình ảnh đã chọn:</Text>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            </View>
          )}
          <Modal
            visible={isImagePickerVisible}
            animationType="slide"
            transparent={true}>
            <Column style={styles.imagePickerOverlay}>
              <Column style={styles.imagePickerContainer}>

                <TouchableOpacity style={styles.option} onPress={openCamera}>
                  <NormalText text="Chụp ảnh mới" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={pickImage}>
                  <NormalText text="Chọn ảnh từ thư viện" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.option}
                  onPress={() => setImagePickerVisible(false)}>
                  <NormalText text="Hủy bỏ" />
                </TouchableOpacity>

              </Column>
            </Column>
          </Modal>
        </Column>
      )}
    </>
  )
}
const MessageItem = ({ item }) => {
    const isYou = item.isYou;
  
    return (
      <Row style={[styles.messageContainer, isYou && styles.yourMessage]}>
        {!isYou && (
          <Image
            source={{ uri: "https://catscanman.net/wp-content/uploads/2021/09/anh-meo-cute-de-thuong-32.jpg" }}
            style={styles.avatar}
          />
        )}
  
        <Column style={[styles.messageContent, isYou && { backgroundColor: colors.green100 }]}>
          {!isYou && <NormalText text={item.userName} style={{ fontWeight: "500" }} />}
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.sentImage} />
          ) : (
            <NormalText text={item.message} />
          )}
        </Column>
      </Row>
    );
  };
export default ChatWithUser

const styles = StyleSheet.create({
    chatRoom: {
        backgroundColor: colors.fbBg,
        paddingVertical: 16,
        flex: 1,
      },
      header: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 20,
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 6,
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
      messageContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
        maxWidth: "80%",
      },
      yourMessage: {
        alignSelf: "flex-end",
        flexDirection: "row-reverse",
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
      },
      messageContent: {
        maxWidth: "80%",
        backgroundColor: "white",
        elevation: 2,
        padding: 10,
        borderRadius: 6,
        borderBottomColor: colors.gray300,
        borderBottomWidth: 1,
      },
      sentImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginTop: 5,
        alignSelf: "center",
      },
})