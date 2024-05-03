import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Start from "./components/Start";
import Chat from "./components/Chat";

const Stack = createNativeStackNavigator();

const App = () => {
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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen
          name="Chat"
          component={(props) => <Chat db={db} storage={storage} {...props} />}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
