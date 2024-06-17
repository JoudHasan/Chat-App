import React, { useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";
import { getStorage } from "firebase/storage";

// Chat component to handle chat functionalities
const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, backgroundColor, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const storage = getStorage();

  useEffect(() => {
    // Set the chat screen title to the user's name
    navigation.setOptions({ title: name });

    let unsubMessages = null;

    // If the user is connected, fetch messages from Firestore
    if (isConnected) {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        const newMessages = documentsSnapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        }));
        cacheMessages(newMessages); // Cache messages locally
        setMessages(newMessages); // Update state with new messages
      });
    } else {
      loadCachedMessages(); // Load messages from local cache
    }

    return () => {
      if (unsubMessages) {
        unsubMessages(); // Clean up the listener
      }
    };
  }, [isConnected, db, navigation, name]);

  // Cache messages locally using AsyncStorage
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log("Error caching messages: ", error.message);
    }
  };

  // Load cached messages from AsyncStorage
  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || "[]";
    setMessages(JSON.parse(cachedMessages));
  };

  // Handle sending of new messages
  const onSend = async (newMessages) => {
    if (isConnected) {
      try {
        const messageToAdd = {
          ...newMessages[0],
          createdAt: new Date(),
        };
        await addDoc(collection(db, "messages"), messageToAdd);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, newMessages)
        );
      } catch (error) {
        console.error("Failed to send message: ", error);
      }
    } else {
      Alert.alert("You're offline. Unable to send messages.");
    }
  };

  // Render the input toolbar conditionally based on connection status
  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />;
    } else {
      return null; // Hide the toolbar when offline
    }
  };

  // Customize the appearance of chat bubbles
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000",
        },
        left: {
          backgroundColor: "#FFF",
        },
      }}
    />
  );

  // Render custom actions in the chat
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} {...props} />;
  };

  // Render custom view components (e.g., map view, audio message) in the chat
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    } else if (currentMessage.audio) {
      return (
        <View style={{ padding: 10 }}>
          <Text>Audio message</Text>
          <TouchableOpacity onPress={() => playAudio(currentMessage.audio)}>
            <Text>Play</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  // Play audio messages
  const playAudio = async (audioURI) => {
    const { sound } = await Audio.Sound.createAsync({ uri: audioURI });
    await sound.playAsync();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={[styles.container, { backgroundColor }]}>
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          onSend={(messages) => onSend(messages)}
          renderActions={renderCustomActions}
          renderCustomView={renderCustomView}
          user={{
            _id: userId,
            name,
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

// Define styles for the chat component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
  },
  locationContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
});

export default Chat;
