// Import AsyncStorage from "@react-native-async-storage/async-storage"
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to store data in AsyncStorage
export const storeData = async (key, value) => {
  try {
    // Attempt to set item in AsyncStorage with provided key-value pair
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    // If an error occurs during storage, log the error
    console.log("Error storing value: ", error);
  }
};

// Function to retrieve data from AsyncStorage
export const getData = async (key) => {
  try {
    // Attempt to get item from AsyncStorage using provided key
    const value = await AsyncStorage.getItem(key);
    return value; // Return the retrieved value
  } catch (error) {
    // If an error occurs during retrieval, log the error
    console.log("Error retrieving value: ", error);
  }
};
