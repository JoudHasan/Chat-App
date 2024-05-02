import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";
const image = require("../img/background.png");

const Start = ({ navigation }) => {
  const auth = getAuth();
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Handle the sign-in anonymously process for the user.
  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("Chat", {
          name: name,
          background: selectedColor,
          userID: result.user.uid,
        });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try again later.");
      });
  };

  // Function to handle color change
  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <View style={styles.container}>
        <Text style={styles.title}>ChitChat</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Type your username here"
          placeholderTextColor="black"
        />
        <View style={styles.colorPicker}>
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: "darkgreen" }]}
            onPress={() => handleColorChange("darkgreen")}
          />
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: "darkgrey" }]}
            onPress={() => handleColorChange("darkgrey")}
          />
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: "darkgoldenrod" }]}
            onPress={() => handleColorChange("darkgoldenrod")}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={signInUser}>
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
        {Platform.OS === "android" && (
          <KeyboardAvoidingView behavior="height" />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "black",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 50,
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    color: "black",
    borderColor: "black",
    borderRadius: 5,
    backgroundColor: "white",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  colorPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "88%",
    marginBottom: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Start;
