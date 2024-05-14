// Import necessary modules from React and React Navigation
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen"; // Import HomeScreen component
import { LogBox } from "react-native"; // Import LogBox for ignoring certain logs

// Create a stack navigator
const Stack = createNativeStackNavigator();

// Ignore certain non-serializable logs
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

// Define the main navigation component
export default function AppNavigation() {
  return (
    // NavigationContainer is the root component for navigation
    <NavigationContainer>
      {/* Stack Navigator for managing navigation between screens */}
      <Stack.Navigator>
        {/* HomeScreen component is the initial screen */}
        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
