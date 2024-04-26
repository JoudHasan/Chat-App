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

const image = require("../img/background.png");

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
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Chat", {
              name: name,
              backgroundColor: selectedColor,
            })
          }
        >
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
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
    color: "#black",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 210,
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
