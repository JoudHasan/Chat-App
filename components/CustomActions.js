import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
  Modal,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Audio } from "expo-av";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import Ionicons from "@expo/vector-icons/Ionicons";

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  id,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [recordingObject, setRecordingObject] = useState(null);

  useEffect(() => {
    return () => {
      if (recordingObject) {
        recordingObject.stopAndUnloadAsync();
      }
    };
  }, [recordingObject]);

  const pickImage = async () => {
    setModalVisible(false);
    const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissions.granted) {
      Alert.alert("Permissions haven't been granted.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const imageURI = result.assets[0].uri;
      console.log("Image URI:", imageURI); // Logging the image URI
      await uploadAndSendImage(imageURI);
    }
  };

  const takePhoto = async () => {
    setModalVisible(false);
    const permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissions.granted) {
      Alert.alert("Permissions haven't been granted.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const imageURI = result.assets[0].uri;
      console.log("Photo URI:", imageURI); // Logging the photo URI
      await uploadAndSendImage(imageURI);
    }
  };

  const uploadAndSendImage = async (imageURI) => {
    try {
      const uniqueRefString = generateReference(imageURI);
      const newUploadRef = ref(storage, uniqueRefString);
      const response = await fetch(imageURI);
      const blob = await response.blob();
      console.log("Uploading image...");
      uploadBytes(newUploadRef, blob).then(async (snapshot) => {
        const imageURL = await getDownloadURL(snapshot.ref);
        console.log("Image URL:", imageURL); // Logging the image URL
        onSend({ image: imageURL });
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/").pop();
    return `${id}/${timeStamp}-${imageName}`;
  };

  const getLocation = async () => {
    setModalVisible(false);
    const permissions = await Location.requestForegroundPermissionsAsync();
    if (!permissions.granted) {
      Alert.alert("Permissions haven't been granted.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    if (location) {
      onSend({
        location: {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        },
      });
    } else {
      Alert.alert("Error occurred while fetching location");
    }
  };

  const startRecording = async () => {
    setModalVisible(false);
    const permissions = await Audio.requestPermissionsAsync();
    if (!permissions.granted) {
      Alert.alert("Failed to get recording permissions.");
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecordingObject(recording);

      Alert.alert(
        "Recording...",
        undefined,
        [
          {
            text: "Cancel",
            onPress: stopRecording,
          },
          {
            text: "Stop and Send",
            onPress: sendRecordedSound,
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert("Failed to start recording!");
    }
  };

  const stopRecording = async () => {
    if (recordingObject) {
      await recordingObject.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
      });
    }
  };

  const sendRecordedSound = async () => {
    if (recordingObject) {
      await stopRecording();
      const uri = recordingObject.getURI();
      const uniqueRefString = generateReference(uri);
      const newUploadRef = ref(storage, uniqueRefString);
      const response = await fetch(uri);
      const blob = await response.blob();
      uploadBytes(newUploadRef, blob).then(async (snapshot) => {
        const soundURL = await getDownloadURL(snapshot.ref);
        onSend({ audio: soundURL });
      });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={[styles.container, wrapperStyle]}
        onPress={() => setModalVisible(true)}
        accessible={true}
        accessibilityLabel="Show actions"
        accessibilityHint="Show action sheet to choose an action"
        accessibilityRole="button"
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[styles.modalButton, wrapperStyle]}
              onPress={pickImage}
            >
              <Ionicons name="image-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Choose From Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, wrapperStyle]}
              onPress={takePhoto}
            >
              <Ionicons name="camera-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, wrapperStyle]}
              onPress={getLocation}
            >
              <Ionicons name="location-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Send Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, wrapperStyle]}
              onPress={startRecording}
            >
              <Ionicons name="mic-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Record Sound</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, wrapperStyle]}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#075E54",
    borderRadius: 25,
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#075E54",
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
});

export default CustomActions;
