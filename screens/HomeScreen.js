// Import necessary components and functions from React Native and other files
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/outline";
import { CalendarDaysIcon, MapPinIcon } from "react-native-heroicons/solid";
import { debounce } from "lodash";
import { theme } from "../theme"; // Import theme object
import { fetchLocations, fetchWeatherForecast } from "../api/weather"; // Import functions for fetching weather data
import * as Progress from "react-native-progress";
import { StatusBar } from "expo-status-bar";
import { weatherImages } from "../constants"; // Import weatherImages object
import { getData, storeData } from "../utils/asyncStorage"; // Import functions for AsyncStorage

export default function HomeScreen() {
  // State variables
  const [showSearch, toggleSearch] = useState(false); // State to toggle search input
  const [locations, setLocations] = useState([]); // State to store fetched locations
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [weather, setWeather] = useState({}); // State to store weather data

  // Function to handle search input
  const handleSearch = (search) => {
    if (search && search.length > 2)
      fetchLocations({ cityName: search }).then((data) => {
        setLocations(data);
      });
  };

  // Function to handle location selection
  const handleLocation = (loc) => {
    setLoading(true); // Set loading state to true
    toggleSearch(false); // Hide search input
    setLocations([]); // Clear locations array
    // Fetch weather forecast for selected location
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setLoading(false); // Set loading state to false
      setWeather(data); // Set weather data
      storeData("city", loc.name); // Store selected city in AsyncStorage
    });
  };

  // Fetch weather data for user's city on component mount
  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  // Function to fetch weather data for user's city
  const fetchMyWeatherData = async () => {
    let myCity = await getData("city"); // Get user's city from AsyncStorage
    let cityName = "lagos"; // Default city name
    if (myCity) {
      cityName = myCity; // If user's city is available, set it as cityName
    }
    // Fetch weather forecast for cityName
    fetchWeatherForecast({
      cityName,
      days: "7",
    }).then((data) => {
      setWeather(data); // Set weather data
      setLoading(false); // Set loading state to false
    });
  };

  // Debounce the search input to avoid rapid API calls
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  // Destructuring weather object
  const { location, current } = weather;

  // Render JSX
  return (
    <View className="relative flex-1">
      <StatusBar style="light" />
      <Image
        blurRadius={60}
        source={require("../assets/images/bg.png")}
        className="absolute h-full w-full"
      />
      {loading ? (
        // Show loading indicator if data is loading
        <View className="flex-1 items-center justify-center">
          <Progress.Bar indeterminate size={250} color="#0bb3b2" />
          <Text className='text-xl font-bold text-white mt-4 text-center'>Fetching data...</Text>
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          {/* Search section */}
          <View style={{ height: "7%" }} className="relative z-50 mx-4">
            <View
              className="flex-row items-center justify-end rounded-lg"
              style={{
                backgroundColor: showSearch
                  ? theme.bgWhite(0.2)
                  : "transparent",
              }}
            >
              {showSearch ? (
                // Show search input if showSearch is true
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search for any city"
                  placeholderTextColor={"lightgray"}
                  className="h-10 flex-1 pb-1 pl-6 text-base text-white"
                />
              ) : null}
              <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                className={`${
                  showSearch ? "rounded-lg" : "rounded-full"
                } m-1 p-3`}
                style={{ backgroundColor: theme.bgWhite(0.3) }}
              >
                {showSearch ? (
                  <XMarkIcon size="25" color="white" />
                ) : (
                  <MagnifyingGlassIcon size="25" color="white" />
                )}
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              // Show search results if locations array is not empty and showSearch is true
              <View className="absolute top-16 w-full rounded-lg bg-gray-300 ">
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder
                    ? " border-b-2 border-b-gray-400"
                    : "";
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleLocation(loc)}
                      className={
                        "mb-1 flex-row items-center border-0 p-3 px-4 " +
                        borderClass
                      }
                    >
                      <MapPinIcon size="20" color="gray" />
                      <Text className="ml-2 text-lg text-black">
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* Forecast section */}
          <View className="mx-4 mb-2 flex flex-1 justify-around">
            {/* Location */}
            <Text className="text-center text-2xl font-bold text-white">
              {location?.name}, {""}
              <Text className="text-lg font-semibold text-gray-300">
                {location?.country}
              </Text>
            </Text>
            {/* Weather icon */}
            <View className="flex-row justify-center">
              <Image
                source={weatherImages[current?.condition?.text || "other"]}
                className="h-52 w-52"
              />
            </View>
            {/* Degree Celsius */}
            <View className="space-y-2">
              <Text className="ml-5 text-center text-6xl font-bold text-white">
                {Math.round(current?.temp_c)}&#176; {/* Display current temperature rounded to the nearest whole number */}
              </Text>
              <Text className="text-center text-xl tracking-widest text-white">
                {current?.condition?.text}
              </Text>
            </View>

            {/* Other stats */}
            <View className="mx-4 flex-row justify-between">
              <View className="flex-row items-center space-x-2">
                <Image
                  source={require("../assets/icons/wind.png")}
                  className="h-6 w-6"
                />
                <Text className="text-base font-semibold text-white">
                  {current?.wind_kph}km
                </Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <Image
                  source={require("../assets/icons/drop.png")}
                  className="h-6 w-6"
                />
                <Text className="text-base font-semibold text-white">
                  {current?.humidity}%
                </Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <Image
                  source={require("../assets/icons/sun.png")}
                  className="h-6 w-6"
                />
                <Text className="text-base font-semibold text-white">
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>

          {/* Forecast for next days */}
          <View className="mb-2 space-y-3">
            <View className="mx-5 flex-row items-center space-x-2">
              <CalendarDaysIcon size="22" color="white" />
              <Text className="text-base text-white">Daily forecast</Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday?.map((item, index) => {
                const date = new Date(item.date);
                const options = { weekday: "long" };
                let dayName = date.toLocaleDateString("en-US", options);
                dayName = dayName.split(",")[0];

                return (
                  <View
                    key={index}
                    className="mr-4 flex w-28 items-center justify-center space-y-1 rounded-lg py-3"
                    style={{ backgroundColor: theme.bgWhite(0.15) }}
                  >
                    <Image
                      source={
                        weatherImages[item?.day?.condition?.text || "other"]
                      }
                      className="h-11 w-14"
                    />
                    <Text className="text-white">{dayName}</Text>
                    <Text className="text-xl font-semibold text-white">
                      {Math.round(item?.day?.avgtemp_c)}&#176; {/* Display average temperature rounded to the nearest whole number */}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
