import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons";

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userID,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to upload the image and send the URL
  const uploadAndSendImage = async (imageURI) => {
    setLoading(true);
    try {
      const uniqueRefString = generateReference(imageURI);
      const response = await fetch(imageURI);
      const blob = await response.blob();
      const newUploadRef = ref(storage, uniqueRefString);
      const snapshot = await uploadBytes(newUploadRef, blob);
      const imageURL = await getDownloadURL(snapshot.ref);
      onSend({ image: imageURL });
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error uploading image:", error.message);
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  // Function to pick an image from the library
  const pickImage = async () => {
    const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      } else {
        Alert.alert("Image selection was canceled.");
      }
    } else {
      Alert.alert(
        "Camera roll access is required to choose images. Please enable it in settings."
      );
    }
  };

  // Function to take a photo using the camera
  const takePhoto = async () => {
    const permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions.granted) {
      const result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        const mediaLibraryPermissions =
          await MediaLibrary.requestPermissionsAsync();
        if (mediaLibraryPermissions.granted) {
          await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
        }
        await uploadAndSendImage(result.assets[0].uri);
      } else {
        Alert.alert("Photo capture was canceled.");
      }
    } else {
      Alert.alert(
        "Camera access is required to take a photo. Please enable it in settings."
      );
    }
  };

  // Function to generate a unique reference string for the image
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/").pop();
    return `${userID}-${timeStamp}-${imageName}`;
  };

  // Function to get the current location
  const getLocation = async () => {
    setLoading(true);
    try {
      const permissions = await Location.requestForegroundPermissionsAsync();
      if (permissions.granted) {
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
      } else {
        Alert.alert(
          "Location access is required to send your location. Please enable it in settings."
        );
      }
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Button to show modal with action options */}
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

      {/* Modal to show action options */}
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
            {loading ? (
              <ActivityIndicator size="large" color="#075E54" />
            ) : (
              <>
                {/* Button to pick an image from the library */}
                <TouchableOpacity
                  style={[styles.modalButton, wrapperStyle]}
                  onPress={pickImage}
                >
                  <Ionicons name="image-outline" size={24} color="white" />
                  <Text style={styles.buttonText}>Choose From Library</Text>
                </TouchableOpacity>

                {/* Button to take a photo using the camera */}
                <TouchableOpacity
                  style={[styles.modalButton, wrapperStyle]}
                  onPress={takePhoto}
                >
                  <Ionicons name="camera-outline" size={24} color="white" />
                  <Text style={styles.buttonText}>Take Picture</Text>
                </TouchableOpacity>

                {/* Button to send the current location */}
                <TouchableOpacity
                  style={[styles.modalButton, wrapperStyle]}
                  onPress={getLocation}
                >
                  <Ionicons name="location-outline" size={24} color="white" />
                  <Text style={styles.buttonText}>Send Location</Text>
                </TouchableOpacity>

                {/* Button to cancel and close the modal */}
                <TouchableOpacity
                  style={[styles.modalButton, wrapperStyle]}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close-outline" size={24} color="white" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
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
