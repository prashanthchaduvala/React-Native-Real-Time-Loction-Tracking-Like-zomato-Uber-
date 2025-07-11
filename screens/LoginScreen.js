// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   Button,
//   Alert,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import API, { setToken } from '../utils/api';

// export default function LoginScreen({ navigation, setIsLoggedIn }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const login = async () => {
//     try {
//       const res = await API.post('login/', { username, password });
//       setToken(res.data.token);
//       setIsLoggedIn(true);
//     } catch (err) {
//       Alert.alert('Login Failed', err.response?.data?.error || 'Unknown error');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         style={styles.input}
//         autoCapitalize="none"
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         style={styles.input}
//         autoCapitalize="none"
//       />
//       <View style={styles.buttonContainer}>
//         <Button title="Login" onPress={login} />
//       </View>

//       <TouchableOpacity
//         onPress={() => navigation.navigate('Register')}
//         style={styles.registerContainer}
//       >
//         <Text style={styles.registerText}>
//           Don’t have an account? <Text style={styles.registerLink}>Register</Text>
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 30,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   input: {
//     height: 50,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     borderRadius: 8,
//     backgroundColor: '#f9f9f9',
//   },
//   buttonContainer: {
//     marginVertical: 10,
//   },
//   registerContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   registerText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   registerLink: {
//     color: '#007bff',
//     textDecorationLine: 'underline',
//   },
// });import React, { useState } from 'react';

import React, { useState } from 'react'; // <-- import useState here
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert,  // <-- import Alert here
} from 'react-native';
import API, { setToken } from '../utils/api';

const { width } = Dimensions.get('window');

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
    <ImageBackground
      source={require('../assets/animations/drones.jpg')} // Corrected image extension to .png
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#ddd"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#ddd"
        />

        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>🚜 Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.registerContainer}
        >
          <Text style={styles.registerText}>
            Don’t have an account? <Text style={styles.registerLink}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)', // dark transparent overlay
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#fff',
  },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  registerContainer: {
    marginTop: 25,
  },
  registerText: {
    color: '#ddd',
    fontSize: 16,
  },
  registerLink: {
    color: '#90caf9',
    textDecorationLine: 'underline',
  },
});
