# React Native Chat Application

Welcome to the React Native Chat Application project! This mobile app allows users to chat with each other, share images, and their location.

## Objective
This chat app is designed for mobile devices using React Native. It provides users with a chat interface and options to share images and their location. The app will be optimized for both Android and iOS devices, utilizing Expo for development and Google Firestore for storing chat messages.

## User Stories
1. As a new user, I want to easily enter a chat room to start talking to friends and family.
2. As a user, I want to send messages to exchange the latest news with friends and family.
3. As a user, I want to share images to show what I’m currently doing.
4. As a user, I want to share my location to show where I am.
5. As a user, I want to read messages offline to reread conversations anytime.
6. As a user with a visual impairment, I want a chat app compatible with a screen reader to engage with the chat interface.

## Key Features
- User authentication and background color selection before joining the chat.
- Chat interface displaying conversations, input field, and submit button.
- Additional communication features: sending images and location data.
- Online and offline storage of chat conversations.
- Compatibility with screen readers for users with visual impairments.

## Technical Requirements
- Developed in React Native using Expo.
- Styled according to given screen design.
- Chat conversations stored in Google Firestore Database.
- Users authenticated anonymously via Google Firebase authentication.
- Local storage of chat conversations.
- Sending images from device's image library and camera.
- Storage of images in Firebase Cloud Storage.
- Access to user's location data and sending via chat in map view.
- Chat interface and functionality created using Gifted Chat library.
- Codebase contains comments for readability.

## How to Use This App - Step By Step Guide
1. **Clone the Repository:** `git clone https://github.com/michaelleoniuk/ChatApp`
2. **Install Dependencies:**
   - React Native
   - Expo
   - Firebase Storage
   - Firebase
   - React Navigation
   - react-native-gifted-chat
   - expo-image-picker
   - expo-location
   - expo-async-storage
3. **Configure Firebase:**
   - Sign in at Google Firebase.
   - Create a Project (uncheck "Enable Google Analytics for this project").
   - Create Database in Firestore Database (choose a close region from the dropdown, and "Start in production mode").
   - Adjust rules to allow read and write.
   - Register app in Project Overview.
   - Install Firebase using `npm install firebase`.
   - Initialize Firebase by copying and pasting the provided Firebase configuration into the `App.js` file.
4. **Run the App:**
   - Download Android Studio on your computer or use the Expo Go App on your mobile device.
   - Run `npx expo start` in your terminal.

## Setting Up Development Environment
- **Check Node Version:** Ensure that your Node version isn't newer than 16.19.0. If it is, downgrade using nvm.
- **Install Expo-CLI:** Install expo-cli globally in your terminal.
- **Create Expo Project:** Using Expo, create a new project for your chat app.

## Developing the App
- **Project Structure:** Create a "components" folder in your project's root. Inside, create two files: Start.js and Chat.js.
- **Start Screen:** Implement a start screen with a text input field for the user's name and a button to enter the chat room.
  - Use Flexbox for layout.
  - Apply stylings as per the provided design.
  - Utilize `ImageBackground` for the background image from the assets folder.
- **Color Selection:** Add different colors for the user to choose from for the chat app's UI background.
  - Use `TouchableOpacity` components for customization.
  - Use fixed widths, heights, and `borderRadius` to display colors.
- **React Navigation:** Install React Navigation and add the navigator to `App.js`.
  - Make the button in the start screen navigate to the chat screen.
  - Display the user's name in the navigation bar at the top of the chat screen.
- **Chat Screen:** Set the chat screen's background to the color chosen by the user in the start screen.
  - Add the color to navigate, similar to the user's name.

## Testing
- **Android Emulator:** Set up Android Emulator and use it to test functionality and UI.
- **iOS Simulator (Optional):** Test your app on iOS Simulator if available.

## Repository and Recording
- **GitHub Repository:** Create a repository for your chat app on GitHub.
  - Commit your app and include this README file.
- **Recording:** Create a short recording demonstrating entering the app via the start screen and navigating to the chat screen.
  - For Android Emulator: Follow instructions in Android Studio for recording.
  - For iOS Simulator: Use the "Record Screen" option in the "File" menu.
- Share the link or upload the recording file to your GitHub repository for review.

Thank you for contributing to the Chat App project! If you have any questions or need assistance, feel free to reach out.
