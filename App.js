import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Start from "./components/Start";
import Chat from "./components/Chat";
import { useNetInfo } from "@react-native-community/netinfo";
import { Alert } from "react-native";

// Main App component
const App = () => {
  const Stack = createNativeStackNavigator();
  const connectionStatus = useNetInfo();

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAEN5zRsJ6dzFFpiqRuW9RLA5VIpL8WbaQ",
    authDomain: "chat-app-26204.firebaseapp.com",
    projectId: "chat-app-26204",
    storageBucket: "chat-app-26204.appspot.com",
    messagingSenderId: "321927240395",
    appId: "1:321927240395:web:7b6b003d7a93b7f101d94e",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);

  // Network connectivity status
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
