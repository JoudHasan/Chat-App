import { useEffect, useState } from "react";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import {
  onSnapshot,
  query,
  orderBy,
  collection,
  addDoc,
} from "firebase/firestore";

const Chat = ({ db, route, navigation, isConnected }) => {
  const { name, background, userID } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: name });
    let unsubMessages;

    if (isConnected) {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        setMessages(newMessages);
      });
    }

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#484848",
        },
        left: {
          backgroundColor: "#fff",
        },
      }}
    />
  );

  const renderInputToolbar = (props) =>
    isConnected ? <InputToolbar {...props} /> : null;

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={onSend}
        user={{
          _id: userID,
          name: name,
        }}
      />
      {Platform.OS === "android" && <KeyboardAvoidingView behavior="height" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
