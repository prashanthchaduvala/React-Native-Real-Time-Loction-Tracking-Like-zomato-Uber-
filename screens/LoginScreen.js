import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import API, { setToken } from '../utils/api';

export default function LoginScreen({ navigation, setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await API.post('login/', { username, password });
      setToken(res.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.error || 'Unknown error');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={login} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
