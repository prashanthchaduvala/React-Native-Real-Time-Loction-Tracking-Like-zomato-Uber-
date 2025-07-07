// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View, Text, Button, ActivityIndicator, Alert, Platform
// } from 'react-native';
// import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
// import * as Location from 'expo-location';
// import API from '../utils/api';
// import { haversineDistance } from '../utils/haversine';

// export default function TrackDistanceScreen({ route }) {
//   const { rideId } = route.params;
//   const [rideStatus, setRideStatus] = useState('');
//   const [isAcceptedUser, setIsAcceptedUser] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const myMarker = useRef(null);
//   const otherMarker = useRef(null);

//   const [myCoord, setMyCoord] = useState(new AnimatedRegion({
//     latitude: 0, longitude: 0, latitudeDelta: 0.01, longitudeDelta: 0.01,
//   }));
//   const [otherCoord, setOtherCoord] = useState(new AnimatedRegion({
//     latitude: 0, longitude: 0, latitudeDelta: 0.01, longitudeDelta: 0.01,
//   }));

//   const fetchData = async () => {
//     try {
//       const [{ data: statusRes }, { data: rideDetails }, { data: me }] = await Promise.all([
//         API.get(`ride/status/${rideId}/`),
//         API.get(`ride/details/${rideId}/`),
//         API.get('user/me/'),
//       ]);
//       setRideStatus(statusRes.status);
//       const isAccepted = (me.id === rideDetails.accepted_by);
//       setIsAcceptedUser(isAccepted);

//       const [{ data: loc1 }, { data: loc2 }] = await Promise.all([
//         API.get(`location/${rideDetails.requester}/`),
//         API.get(`location/${rideDetails.accepted_by}/`),
//       ]);

//       setOtherCoord(prev =>
//         prev.timing({ latitude: loc1.lat, longitude: loc1.lng, duration: 9000 }).start()
//       );

//       const { coords } = await Location.getCurrentPositionAsync({});
//       await API.post('location/update/', { lat: coords.latitude, lng: coords.longitude });

//       setMyCoord(prev =>
//         prev.timing({ latitude: coords.latitude, longitude: coords.longitude, duration: 9000 }).start()
//       );

//       if (rideStatus === 'accepted' || rideStatus === 'started') {
//         mapRef.current.animateToRegion({
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           latitudeDelta: 0.02,
//           longitudeDelta: 0.02,
//         }, 1000);
//       }

//       setLoading(false);

//       const distance = haversineDistance(
//         { lat: coords.latitude, lng: coords.longitude },
//         { lat: loc1.lat, lng: loc1.lng }
//       );

//       if (distance <= 0.1 && rideStatus === 'accepted') {
//         await API.post(`ride/complete/${rideId}/`);
//         Alert.alert('Ride Completed', 'You have reached your destination.');
//       }

//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const mapRef = useRef(null);

//   useEffect(() => {
//     fetchData();
//     const id = setInterval(fetchData, 9000);
//     return () => clearInterval(id);
//   }, [rideStatus]);

//   if (Platform.OS === 'web') {
//     return (
//       <View style={styles.centered}>
//         <Text>Tracking only available on mobile.</Text>
//       </View>
//     );
//   }

//   if (loading) {
//     return <ActivityIndicator style={{ flex: 1 }} size='large' />;
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <Text style={{ padding: 10 }}>Status: {rideStatus}</Text>
//       <MapView
//         ref={mapRef}
//         style={{ flex: 1 }}
//         initialRegion={{
//           latitude: myCoord.latitude.__getValue(),
//           longitude: myCoord.longitude.__getValue(),
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//       >
//         <Marker.Animated ref={myMarker} coordinate={myCoord} title="You" />
//         <Marker.Animated ref={otherMarker} coordinate={otherCoord} title="Other User" />
//       </MapView>

//       {isAcceptedUser && rideStatus === 'accepted' && (
//         <Button title="Start Ride" onPress={() => API.post(`ride/start/${rideId}/`)} />
//       )}
//     </View>
//   );
// }

// const styles = {
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// };

// TrackDistanceScreen.js

/*
  You're experiencing two main issues:
  1. When a ride is accepted, the map sometimes doesn't load.
  2. Sometimes the app crashes or closes unexpectedly.

  Let's fix that with the following improvements:
  - Add error handling for `MapView`
  - Add loading checks before using coordinates
  - Show a vehicle icon for tracking
*/

// // ✅ FIXED: TrackDistanceScreen.js
// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View, Text, Button, ActivityIndicator, Alert, Platform
// } from 'react-native';
// import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
// import * as Location from 'expo-location';
// import API from '../utils/api';
// import { haversineDistance } from '../utils/haversine';

// export default function TrackDistanceScreen({ route }) {
//   const { rideId } = route.params;
//   const [rideStatus, setRideStatus] = useState('');
//   const [isAcceptedUser, setIsAcceptedUser] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [initialized, setInitialized] = useState(false);

//   const mapRef = useRef(null);
//   const myCoord = useRef(new AnimatedRegion({
//     latitude: 0, longitude: 0, latitudeDelta: 0.01, longitudeDelta: 0.01
//   })).current;
//   const otherCoord = useRef(new AnimatedRegion({
//     latitude: 0, longitude: 0, latitudeDelta: 0.01, longitudeDelta: 0.01
//   })).current;

//   const fetchData = async () => {
//     try {
//       const [{ data: statusRes }, { data: rideDetails }, { data: me }] = await Promise.all([
//         API.get(`ride/status/${rideId}/`),
//         API.get(`ride/details/${rideId}/`),
//         API.get('user/me/'),
//       ]);

//       setRideStatus(statusRes.status);
//       const requesterId = rideDetails.requester?.id || rideDetails.requester;
//       const acceptedById = rideDetails.accepted_by?.id || rideDetails.accepted_by;
//       if (!acceptedById) return;
//       setIsAcceptedUser(me.id === acceptedById);

//       const [{ data: loc1 }, { data: loc2 }] = await Promise.all([
//         API.get(`location/${requesterId}/`),
//         API.get(`location/${acceptedById}/`)
//       ]);

//       otherCoord.timing({
//         latitude: loc1.lat,
//         longitude: loc1.lng,
//         duration: 3000,
//         useNativeDriver: false,
//       }).start();

//       const { coords } = await Location.getCurrentPositionAsync({});
//       await API.post('location/update/', { lat: coords.latitude, lng: coords.longitude });
//       myCoord.timing({
//         latitude: coords.latitude,
//         longitude: coords.longitude,
//         duration: 3000,
//         useNativeDriver: false,
//       }).start();

//       if (!initialized && mapRef.current) {
//         mapRef.current.animateToRegion({
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           latitudeDelta: 0.02,
//           longitudeDelta: 0.02,
//         }, 1000);
//         setInitialized(true);
//       }

//       const distance = haversineDistance(
//         { lat: coords.latitude, lng: coords.longitude },
//         { lat: loc1.lat, lng: loc1.lng }
//       );

//       if (distance <= 0.1 && rideStatus === 'accepted') {
//         await API.post(`ride/start/${rideId}/`);
//         setRideStatus('started');
//         Alert.alert('Ride Started', 'The ride has begun.');
//       } else if (distance <= 0.1 && rideStatus === 'started') {
//         await API.post(`ride/complete/${rideId}/`);
//         setRideStatus('completed');
//         Alert.alert('Ride Completed', 'You have reached your destination.');
//       }

//       setLoading(false);
//     } catch (err) {
//       console.log('Track error:', err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     const id = setInterval(fetchData, 9000);
//     return () => clearInterval(id);
//   }, []);

//   if (Platform.OS === 'web') {
//     return <View><Text>Tracking works only on mobile devices.</Text></View>;
//   }

//   if (loading || !initialized) {
//     return <ActivityIndicator style={{ flex: 1 }} size="large" color="blue" />;
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <Text style={{ padding: 10 }}>Ride Status: {rideStatus}</Text>
//       <MapView
//         ref={mapRef}
//         style={{ flex: 1 }}
//         initialRegion={{
//           latitude: myCoord.__getValue().latitude,
//           longitude: myCoord.__getValue().longitude,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//       >
//         <Marker.Animated coordinate={myCoord} title="You" />
//         <Marker.Animated coordinate={otherCoord} title="Other User" pinColor="green" />
//       </MapView>
//     </View>
//   );
// }

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import * as Location from 'expo-location';
import API from '../utils/api';
import { haversineDistance } from '../utils/haversine';

export default function TrackDistanceScreen({ route }) {
  const { rideId } = route.params;
  const [rideStatus, setRideStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  const myCoord = useRef(new AnimatedRegion({ latitude: 0, longitude: 0, latitudeDelta: 0.01, longitudeDelta: 0.01 })).current;
  const otherCoord = useRef(new AnimatedRegion({ latitude: 0, longitude: 0, latitudeDelta: 0.01, longitudeDelta: 0.01 })).current;

  const fetchAndUpdate = async () => {
    try {
      const [statusRes, detailsRes, meRes] = await Promise.all([
        API.get(`ride/status/${rideId}/`),
        API.get(`ride/details/${rideId}/`),
        API.get('user/me/')
      ]);

      setRideStatus(statusRes.data.status);

      const requesterId = detailsRes.data.requester?.id || detailsRes.data.requester;
      const acceptedById = detailsRes.data.accepted_by?.id || detailsRes.data.accepted_by;

      const [loc1, loc2] = await Promise.all([
        API.get(`location/${requesterId}/`),
        API.get(`location/${acceptedById}/`)
      ]);

      const { coords } = await Location.getCurrentPositionAsync({});
      await API.post('location/update/', { lat: coords.latitude, lng: coords.longitude });

      myCoord.timing({ latitude: coords.latitude, longitude: coords.longitude, duration: 2000, useNativeDriver: false }).start();
      otherCoord.timing({ latitude: loc1.data.lat, longitude: loc1.data.lng, duration: 2000, useNativeDriver: false }).start();

      const distance = haversineDistance(
        { lat: coords.latitude, lng: coords.longitude },
        { lat: loc1.data.lat, lng: loc1.data.lng }
      );

      if (distance <= 0.1 && rideStatus === 'accepted') {
        await API.post(`ride/start/${rideId}/`);
        setRideStatus('started');
        Alert.alert('Ride Started');
      } else if (distance <= 0.1 && rideStatus === 'started') {
        await API.post(`ride/complete/${rideId}/`);
        setRideStatus('completed');
        Alert.alert('Ride Completed');
      }

      setLoading(false);
    } catch (err) {
      console.log('Tracking error:', err);
    }
  };

  useEffect(() => {
    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 9000);
    return () => clearInterval(interval);
  }, []);

  if (Platform.OS === 'web') return <Text>Tracking works only on device.</Text>;
  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 10 }}>Ride Status: {rideStatus}</Text>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: myCoord.__getValue().latitude,
          longitude: myCoord.__getValue().longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker.Animated coordinate={myCoord} title="You" />
        <Marker.Animated coordinate={otherCoord} title="Other User" pinColor="green" />
      </MapView>
    </View>
  );
}
