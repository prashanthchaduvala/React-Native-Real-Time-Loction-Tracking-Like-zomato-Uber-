// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   Button,
//   Alert,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import API from '../utils/api';

// export default function RegisterScreen({ navigation }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');

//   const register = async () => {
//     try {
//       await API.post('register/', { username, password, email });
//       Alert.alert('Success', 'User created. Please login.');
//       navigation.replace('Login');
//     } catch (err) {
//       Alert.alert('Register Failed', err.response?.data?.error || 'Unknown error');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Register</Text>
//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         style={styles.input}
//         autoCapitalize="none"
//       />
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         style={styles.input}
//       />
//       <View style={styles.buttonContainer}>
//         <Button title="Register" onPress={register} />
//       </View>

//       <TouchableOpacity
//         onPress={() => navigation.replace('Login')}
//         style={styles.loginContainer}
//       >
//         <Text style={styles.loginText}>
//           Already have an account? <Text style={styles.loginLink}>Login</Text>
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
//   loginContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   loginText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   loginLink: {
//     color: '#007bff',
//     textDecorationLine: 'underline',
//   },
// });import React, { useState } from 'react';
import React, { useState } from 'react'; // Added useState import
import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
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
    <ImageBackground
      source={require('../assets/animations/farmer.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#ddd"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#ddd"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#ddd"
        />

        <View style={styles.buttonContainer}>
          <Button title="Register" onPress={register} color="#4caf50" />
        </View>

        <TouchableOpacity
          onPress={() => navigation.replace('Login')}
          style={styles.loginContainer}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Login</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#fff',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  loginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
  },
  loginLink: {
    color: '#90caf9',
    textDecorationLine: 'underline',
  },
});
