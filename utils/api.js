

// utils/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: '',
});

export const loadToken = async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    API.defaults.headers.common['Authorization'] = `Token ${token}`;
  }
};

export const setToken = async (token) => {
  await AsyncStorage.setItem('token', token);
  API.defaults.headers.common['Authorization'] = `Token ${token}`;
};

// <--- Add this function:
export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
  } catch (e) {
    console.error('Error clearing token', e);
  }
};

export default API;
