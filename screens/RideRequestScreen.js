import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, Alert, FlatList, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import API, { setToken } from '../utils/api';

export default function RideRequestScreen({ navigation, setIsLoggedIn }) {
  const [fromPlace, setFromPlace] = useState('');
  const [toPlace, setToPlace] = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setFromCoords({ lat: coords.latitude, lng: coords.longitude });
    })();
  }, []);

  const fetchSuggestions = async (query, setter) => {
    if (!query || query.length < 2) {
      setter([]);
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setter(data.map((item) => item.display_name));
    } catch (err) {
      setter([]);
    }
  };

  const createRide = async () => {
  if (!fromCoords || !toPlace) return Alert.alert('Error', 'Missing pickup or destination');

  try {
    const toRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(toPlace)}`);
    const toData = await toRes.json();
    if (!toData.length) return Alert.alert('Error', 'Destination not found');

    const to = {
      lat: parseFloat(toData[0].lat),
      lng: parseFloat(toData[0].lon),
    };

    const res = await API.post('ride/create/', {
      from_lat: fromCoords.lat,
      from_lng: fromCoords.lng,
      to_lat: to.lat,
      to_lng: to.lng,
    });

    const rideId = res.data.ride?.id || res.data.id;

    Alert.alert(
      'Ride Created',
      res.data.message || 'Your ride has been created.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('TrackDistance', { rideId }),
        },
      ]
    );

  } catch (err) {
    console.log('Create ride error:', err.response?.data || err.message);
    Alert.alert('Error', 'Could not create ride.');
  }
};

  const logout = () => {
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Pickup Location (Optional label)</Text>
      <TextInput
        value={fromPlace}
        onChangeText={(text) => {
          setFromPlace(text);
          fetchSuggestions(text, setFromSuggestions);
        }}
        placeholder="Enter pickup location (optional override)"
        style={{ borderWidth: 1, marginBottom: 5 }}
      />
      {fromSuggestions.length > 0 && (
        <FlatList
          data={fromSuggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={async () => {
                setFromPlace(item);
                setFromSuggestions([]);
                const geo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(item)}`);
                const [location] = await geo.json();
                setFromCoords({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
              }}
            >
              <Text style={{ padding: 5, backgroundColor: '#eee' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Text>Destination</Text>
      <TextInput
        value={toPlace}
        onChangeText={(text) => {
          setToPlace(text);
          fetchSuggestions(text, setToSuggestions);
        }}
        placeholder="Enter destination"
        style={{ borderWidth: 1, marginBottom: 5 }}
      />
      {toSuggestions.length > 0 && (
        <FlatList
          data={toSuggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setToPlace(item);
                setToSuggestions([]);
              }}
            >
              <Text style={{ padding: 5, backgroundColor: '#eee' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Button title="Request Ride" onPress={createRide} />
      <Button title="Go to Accept Ride" onPress={() => navigation.navigate('AcceptRide')} />
      <Button title="Logout" onPress={logout} color="red" />
    </View>
  );
}
