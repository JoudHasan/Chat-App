import React from "react";
import { TouchableOpacity, StyleSheet, View, Text, Alert } from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons";

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage }) => {
  // Pick an image from the library
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.canceled) {
        const imageURI = result.assets[0].uri;
        await uploadAndSendImage(imageURI); // Upload and send the chosen image
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  // Take a photo using the camera
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions.granted) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.canceled) {
        const imageURI = result.assets[0].uri;
        await uploadAndSendImage(imageURI); // Upload and send the taken photo
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  // Upload and send an image to Firestore
  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref);
      onSend({ image: imageURL }); // Send the image URL in the chat
    });
  };

  // Generate a unique reference for the image
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/").pop();
    return `${timeStamp}-${imageName}`;
  };

  // Get the current location of the user
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        }); // Send the location in the chat
      } else {
        Alert.alert("Error occurred while fetching location");
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={[styles.container, wrapperStyle]}
        onPress={pickImage}
        accessible={true}
        accessibilityLabel="Choose an image from the library"
        accessibilityHint="Open the media library to choose an image"
        accessibilityRole="button"
      >
        <Ionicons name="image-outline" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.container, wrapperStyle]}
        onPress={takePhoto}
        accessible={true}
        accessibilityLabel="Take a picture"
        accessibilityHint="Open the camera to take a picture"
        accessibilityRole="button"
      >
        <Ionicons name="camera-outline" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.container, wrapperStyle]}
        onPress={getLocation}
        accessible={true}
        accessibilityLabel="Send location"
        accessibilityHint="Send your current location"
        accessibilityRole="button"
      >
        <Ionicons name="location-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

// Define styles for the CustomActions component
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
});

export default CustomActions;
