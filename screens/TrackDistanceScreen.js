import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import API from '../utils/api';
import { haversineDistance } from '../utils/haversine';

export default function TrackDistanceScreen({ route }) {
  const { rideId } = route.params;
  const [myLocation, setMyLocation] = useState(null);
  const [otherLocation, setOtherLocation] = useState(null);
  const [rideStatus, setRideStatus] = useState('');
  const [isAcceptedUser, setIsAcceptedUser] = useState(false);

  const fetchData = async () => {
    try {
      const rideRes = await API.get(`ride/status/${rideId}/`);
      setRideStatus(rideRes.data.status);

      const rideDetails = await API.get(`ride/details/${rideId}/`);
      const currentUser = await API.get('user/me/');

      setIsAcceptedUser(currentUser.data.id === rideDetails.data.accepted_by);

      const loc1 = await API.get(`location/${rideDetails.data.requester}/`);
      const loc2 = await API.get(`location/${rideDetails.data.accepted_by}/`);

      setOtherLocation(loc1.data); // always show other user
      const { coords } = await Location.getCurrentPositionAsync({});
      setMyLocation({ lat: coords.latitude, lng: coords.longitude });

      await API.post('location/update/', { lat: coords.latitude, lng: coords.longitude });

    } catch (err) {
      console.log('Error:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartRide = async () => {
    await API.post(`ride/start/${rideId}/`);
    setRideStatus('started');
  };

  const handleCompleteRide = async () => {
    await API.post(`ride/complete/${rideId}/`);
    setRideStatus('completed');
  };

  const distance = myLocation && otherLocation ?
    haversineDistance(myLocation, otherLocation).toFixed(2) : '...';

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 10 }}>Ride Status: {rideStatus}</Text>
      <Text style={{ padding: 10 }}>Distance: {distance} km</Text>
      {myLocation && otherLocation && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: myLocation.lat,
            longitude: myLocation.lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker coordinate={{ latitude: myLocation.lat, longitude: myLocation.lng }} title="You" />
          <Marker coordinate={{ latitude: otherLocation.lat, longitude: otherLocation.lng }} title="Other User" />
        </MapView>
      )}

      {isAcceptedUser && rideStatus === 'accepted' && parseFloat(distance) < 0.2 && (
        <Button title="Start Ride" onPress={handleStartRide} />
      )}

      {isAcceptedUser && rideStatus === 'started' && (
        <Button title="Complete Ride" onPress={handleCompleteRide} color="green" />
      )}
    </View>
  );
}
