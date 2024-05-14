// Import Axios for making HTTP requests
import axios from 'axios';
// Import API key from constants
import { apiKey } from "../constants";

// Function to generate forecast endpoint URL
const forecastEndpoint = (params) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}`;
// Function to generate locations endpoint URL
const locationsEndpoint = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

// Function to make API call
const apiCall = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
  };

  try {
    // Make a request using Axios
    const response = await axios.request(options);
    return response.data; // Return response data
  } catch (error) {
    // If an error occurs during the request, log the error and return an empty object
    console.log("error: ", error);
    return {};
  }
};

// Function to fetch weather forecast
export const fetchWeatherForecast = (params) => {
  let forecastUrl = forecastEndpoint(params); // Generate forecast endpoint URL
  return apiCall(forecastUrl); // Make API call to fetch weather forecast
};

// Function to fetch locations
export const fetchLocations = (params) => {
  let locationsUrl = locationsEndpoint(params); // Generate locations endpoint URL
  return apiCall(locationsUrl); // Make API call to fetch locations
};
