import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

const image = { uri: "https://legacy.reactjs.org/logo-og.png" };

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#ffffff");

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
          placeholderTextColor="#ffffff" // Placeholder text color
        />
        <View style={styles.colorPicker}>
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: "#ff6347" }]}
            onPress={() => handleColorChange("#ff6347")}
          />
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: "#00bfff" }]}
            onPress={() => handleColorChange("#00bfff")}
          />
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: "#32cd32" }]}
            onPress={() => handleColorChange("#32cd32")}
          />
        </View>
        <Button
          title="Start Chatting"
          color="#ffffff" // White button text color
          onPress={() =>
            navigation.navigate("Chat", {
              name: name,
              backgroundColor: selectedColor,
            })
          }
        />
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
    color: "#ffffff", // White text color
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    color: "#ffffff", // White text color
    borderColor: "#ffffff", // White border color
    borderRadius: 5,
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
});

export default Start;
