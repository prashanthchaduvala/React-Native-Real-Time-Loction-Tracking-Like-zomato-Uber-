// utils/api.js
// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://127.0.0.1:6001/',
// });

// export let authToken = null;

// export const setToken = (token) => {
//   authToken = token;
//   API.defaults.headers.common['Authorization'] = `Token ${token}`;
// };

// export default API;

// import axios from 'axios';

// // const API = axios.create({
// //   baseURL: 'http://127.0.0.1:6001/',
// //   // baseURL:'http://192.168.231.85:6001/', 
// // });

// const API = axios.create({
//     baseURL: 'https://api-test3.cdaitsolutions.com',
//     // baseURL:'http://192.168.231.85:6001/',
//     // baseURL: 'http://127.0.0.1:6001/',
// });

// export let authToken = null;

// export const setToken = (token) => {
//   authToken = token;
//   if (token) {
//     API.defaults.headers.common['Authorization'] = `Token ${token}`;
//   } else {
//     delete API.defaults.headers.common['Authorization'];
//   }
// };

// export default API;



// utils/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'https://api-test3.cdaitsolutions.com',
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
