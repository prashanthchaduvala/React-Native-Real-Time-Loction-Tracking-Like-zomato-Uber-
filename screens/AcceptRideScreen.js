// // AcceptRideScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
// import API from '../utils/api';
// import { reverseGeocode } from '../utils/geocode';

// export default function AcceptRideScreen({ navigation }) {
//   const [rides, setRides] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchRides = async () => {
//     try {
//       const res = await API.get('ride/pending/');
//       const ridesWithPlaces = await Promise.all(
//         res.data.map(async (ride) => {
//           const fromPlace = await reverseGeocode(ride.from_lat, ride.from_lng);
//           const toPlace = await reverseGeocode(ride.to_lat, ride.to_lng);
//           return { ...ride, fromPlace, toPlace };
//         })
//       );
//       setRides(ridesWithPlaces);
//     } catch (err) {
//       console.log('Fetch error:', err.response?.data || err.message);
//       Alert.alert('Error', 'Could not load rides');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const acceptRide = async (id) => {
//   try {
//     await API.post(`ride/accept/${id}/`);
//     Alert.alert('Ride Accepted', 'Tracking will begin...');
//     navigation.navigate('TrackDistance', { rideId: id }); // 👈 SHOW MAP
//   } catch (err) {
//     Alert.alert('Error', 'Failed to accept ride');
//   }
// };





//   useEffect(() => {
//     fetchRides();
//   }, []);

//   if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

//   if (rides.length === 0) {
//     return (
//       <View style={{ padding: 20 }}>
//         <Text style={{ fontSize: 16 }}>No pending rides available.</Text>

//       </View>
//     );
//   }

  

//   return (
//     <FlatList
//       data={rides}
//       keyExtractor={(item) => item.id.toString()}
//       renderItem={({ item }) => (
//         <View style={{ padding: 15, borderBottomWidth: 1 }}>
//           <Text>From: {item.fromPlace}</Text>
//           <Text>To: {item.toPlace}</Text>
//           <Text>Requested by: {item.requester?.username} ({item.requester?.email})</Text>
//           <Button title="Accept Ride" onPress={() => acceptRide(item.id)} />
//         </View>
//       )}
//     />
//   );
// }
// AcceptRideScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, Button, FlatList, ActivityIndicator, Alert
} from 'react-native';
import API from '../utils/api';
import { reverseGeocode } from '../utils/geocode';

export default function AcceptRideScreen({ navigation }) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRides = async () => {
    try {
      const res = await API.get('ride/pending/');

      // Convert coordinates to place names using OpenCage reverse geocoding
      const ridesWithPlaces = await Promise.all(
        res.data.map(async (ride) => {
          let fromPlace = 'Unknown';
          let toPlace = 'Unknown';
          try {
            fromPlace = await reverseGeocode(ride.from_lat, ride.from_lng);
            toPlace = await reverseGeocode(ride.to_lat, ride.to_lng);
          } catch (geoErr) {
            console.log('Geocoding error:', geoErr.message);
          }
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
    console.log('Ride ID to accept:', id);
    const res = await API.post(`ride/accept/${id}/`);
    console.log('Ride accepted response:', res.data);
    // Alert.alert('Ride Accepted', 'Tracking will begin...');
    navigation.navigate('TrackDistance', { rideId: id }); // ✅ Check this works
    
  } catch (err) {
    Alert.alert('Error', 'Failed to accept ride');
    console.log('Accept error:', err.response?.data || err.message);
  }
};


  useEffect(() => {
    fetchRides();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (rides.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 16 }}>No pending rides available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={rides}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 15, borderBottomWidth: 1 }}>
          <Text style={{ fontWeight: 'bold' }}>From:</Text>
          <Text>{item.fromPlace}</Text>

          <Text style={{ fontWeight: 'bold', marginTop: 5 }}>To:</Text>
          <Text>{item.toPlace}</Text>

          <Text style={{ marginTop: 5 }}>
            Requested by: {item.requester?.username} ({item.requester?.email})
          </Text>

          <View style={{ marginTop: 10 }}>
            <Button title="Accept Ride" onPress={() => acceptRide(item.id)} />
          </View>
        </View>
      )}
    />
  );
}
