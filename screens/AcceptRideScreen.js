import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import API from '../utils/api';
import { reverseGeocode } from '../utils/geocode';

export default function AcceptRideScreen({ navigation }) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRides = async () => {
    try {
      const res = await API.get('ride/pending/');
      const ridesWithPlaces = await Promise.all(
        res.data.map(async (ride) => {
          const fromPlace = await reverseGeocode(ride.from_lat, ride.from_lng);
          const toPlace = await reverseGeocode(ride.to_lat, ride.to_lng);
          return { ...ride, fromPlace, toPlace };
        })
      );
      setRides(ridesWithPlaces);
    } catch (err) {
      console.log('Fetch error:', err.response?.data || err.message);
      Alert.alert('Error', 'Could not load rides');
    } finally {
      setLoading(false);
    }
  };

  const acceptRide = async (id) => {
    try {
      await API.post(`ride/accept/${id}/`);
      navigation.navigate('TrackDistance', { rideId: id });
    } catch (err) {
      Alert.alert('Error', 'Failed to accept ride');
    }
  };

  const logout = () => {
    setToken(null);           // clear token from axios
    setIsLoggedIn(false);     // go back to login screen
  };



  useEffect(() => {
    fetchRides();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  if (rides.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 16 }}>No pending rides available.</Text>
        <Button title="Logout" onPress={logout} color="red" />

      </View>
    );
  }

  

  return (
    <FlatList
      data={rides}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 15, borderBottomWidth: 1 }}>
          <Text>From: {item.fromPlace}</Text>
          <Text>To: {item.toPlace}</Text>
          <Text>Requested by: {item.requester?.username} ({item.requester?.email})</Text>
          <Button title="Accept Ride" onPress={() => acceptRide(item.id)} />
        </View>
      )}
    />
  );
}
