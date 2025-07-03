import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import API from '../utils/api';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const register = async () => {
    try {
      await API.post('register/', { username, password, email });
      Alert.alert('Success', 'User created. Please login.');
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Register Failed', err.response?.data?.error || 'Unknown error');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Register" onPress={register} />
    </View>
  );
}
