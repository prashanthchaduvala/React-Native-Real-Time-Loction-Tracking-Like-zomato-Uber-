// import React, { useEffect, useState } from 'react';
// import { View, TextInput, Button, Text, Alert, FlatList, TouchableOpacity } from 'react-native';
// import * as Location from 'expo-location';
// import API, { setToken } from '../utils/api';

// export default function RideRequestScreen({ navigation, setIsLoggedIn }) {
//   const [fromPlace, setFromPlace] = useState('');
//   const [toPlace, setToPlace] = useState('');
//   const [fromCoords, setFromCoords] = useState(null);
//   const [fromSuggestions, setFromSuggestions] = useState([]);
//   const [toSuggestions, setToSuggestions] = useState([]);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location permission is required.');
//         return;
//       }

//       const { coords } = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Highest,
//       });

//       setFromCoords({ lat: coords.latitude, lng: coords.longitude });
//     })();
//   }, []);

//   const fetchSuggestions = async (query, setter) => {
//     if (!query || query.length < 2) {
//       setter([]);
//       return;
//     }
//     try {
//       const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
//       const data = await res.json();
//       setter(data.map((item) => item.display_name));
//     } catch (err) {
//       setter([]);
//     }
//   };

//   const createRide = async () => {
//     if (!fromCoords || !toPlace) {
//       Alert.alert('Error', 'Missing pickup or destination');
//       return;
//     }

//     try {
//       // 1. Update live location
//       await API.post('location/update/', {
//         lat: fromCoords.lat,
//         lng: fromCoords.lng
//       });

//       // 2. Geocode destination
//       const toRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(toPlace)}`);
//       const toData = await toRes.json();
//       if (!toData.length) {
//         Alert.alert('Error', 'Destination not found');
//         return;
//       }

//       const to = {
//         lat: parseFloat(toData[0].lat),
//         lng: parseFloat(toData[0].lon),
//       };

//       // 3. Create ride
//       const res = await API.post('ride/create/', {
//         from_lat: fromCoords.lat,
//         from_lng: fromCoords.lng,
//         to_lat: to.lat,
//         to_lng: to.lng,
//       });

//       const rideId = res.data.ride?.id || res.data.id;
//       Alert.alert('Ride Created', 'Waiting for driver to accept...');

//       const intervalId = setInterval(async () => {
//         try {
//           const statusRes = await API.get(`ride/status/${rideId}/`);
//           if (statusRes.data.status === 'accepted') {
//             clearInterval(intervalId);
//             navigation.navigate('TrackDistance', { rideId });
//           }
//         } catch (e) {
//           console.log('Polling error:', e.message);
//         }
//       }, 5000);

//     } catch (err) {
//       console.log('Create ride error:', err.response?.data || err.message);
//       Alert.alert('Error', 'Could not create ride.');
//     }
//   };

//   const logout = () => {
//     setToken(null);
//     setIsLoggedIn(false);
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Pickup Location (Optional label)</Text>
//       <TextInput
//         value={fromPlace}
//         onChangeText={(text) => {
//           setFromPlace(text);
//           fetchSuggestions(text, setFromSuggestions);
//         }}
//         placeholder="Enter pickup location (optional override)"
//         style={{ borderWidth: 1, marginBottom: 5 }}
//       />
//       {fromSuggestions.length > 0 && (
//         <FlatList
//           data={fromSuggestions}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={async () => {
//                 setFromPlace(item);
//                 setFromSuggestions([]);
//                 const geo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(item)}`);
//                 const [location] = await geo.json();
//                 setFromCoords({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//               }}
//             >
//               <Text style={{ padding: 5, backgroundColor: '#eee' }}>{item}</Text>
//             </TouchableOpacity>
//           )}
//         />
//       )}

//       <Text>Destination</Text>
//       <TextInput
//         value={toPlace}
//         onChangeText={(text) => {
//           setToPlace(text);
//           fetchSuggestions(text, setToSuggestions);
//         }}
//         placeholder="Enter destination"
//         style={{ borderWidth: 1, marginBottom: 5 }}
//       />
//       {toSuggestions.length > 0 && (
//         <FlatList
//           data={toSuggestions}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() => {
//                 setToPlace(item);
//                 setToSuggestions([]);
//               }}
//             >
//               <Text style={{ padding: 5, backgroundColor: '#eee' }}>{item}</Text>
//             </TouchableOpacity>
//           )}
//         />
//       )}

//       <Button title="Request Ride" onPress={createRide} />
//     </View>
//   );
// }


import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, Alert, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import API, { setToken } from '../utils/api';
import { forwardGeocode } from '../utils/geocode';

export default function RideRequestScreen({ navigation, setIsLoggedIn }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [toPlace, setToPlace] = useState('');
  const [toSuggestions, setToSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Permission Denied', 'Location permission required');

      const { coords } = await Location.getCurrentPositionAsync({});
      setCurrentLocation({ lat: coords.latitude, lng: coords.longitude });

      await API.post('location/update/', { lat: coords.latitude, lng: coords.longitude });
      setLoading(false);
    })();
  }, []);

  const createRide = async () => {
    if (!currentLocation || !toPlace) return Alert.alert('Error', 'Please enter destination');

    try {
      const results = await forwardGeocode(toPlace);
      if (!results.length) return Alert.alert('Error', 'Destination not found');

      const to = results[0];

      const res = await API.post('ride/create/', {
        from_lat: currentLocation.lat,
        from_lng: currentLocation.lng,
        to_lat: to.lat,
        to_lng: to.lng,
      });

      const rideId = res.data.ride?.id;
      Alert.alert('Ride Requested', 'Waiting for driver...');

      const intervalId = setInterval(async () => {
        const statusRes = await API.get(`ride/status/${rideId}/`);
        if (statusRes.data.status === 'accepted') {
          clearInterval(intervalId);
          navigation.navigate('TrackDistance', { rideId });
        }
      }, 5000);
    } catch (err) {
      Alert.alert('Error', 'Failed to create ride');
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 5 }}>Enter Destination</Text>
      <TextInput
        value={toPlace}
        onChangeText={async (text) => {
          setToPlace(text);
          if (text.length >= 2) {
            const results = await forwardGeocode(text);
            setToSuggestions(results);
          } else {
            setToSuggestions([]);
          }
        }}
        style={{ borderWidth: 1, marginBottom: 5, padding: 5 }}
        placeholder="e.g., Mumbai Central"
      />
      {toSuggestions.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => {
          setToPlace(item.name);
          setToSuggestions([]);
        }}>
          <Text style={{ backgroundColor: '#eee', padding: 5 }}>{item.name}</Text>
        </TouchableOpacity>
      ))}

      <Button title="Request Ride" onPress={createRide} />
    </View>
  );
}
