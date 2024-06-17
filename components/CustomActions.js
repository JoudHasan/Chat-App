import React from "react";
import { TouchableOpacity, StyleSheet, View, Text, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage }) => {
  const actionSheet = useActionSheet();

  // Handle action press to show action sheet options
  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage(); // Handle choosing image from library
            return;
          case 1:
            takePhoto(); // Handle taking a photo
            return;
          case 2:
            getLocation(); // Handle sending location
          default:
        }
      }
    );
  };

  // Pick an image from the library
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
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
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
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
    if (permissions?.granted) {
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
    <TouchableOpacity
      style={styles.container}
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel="This is an input field with a clickable icon that expands a menu"
      accessibilityHint="Choose what type of media to share with your contacts or cancel to collapse menu"
      accessibilityRole="button"
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

// Define styles for the CustomActions component
const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 24,
    color: "white",
  },
});

export default CustomActions;
