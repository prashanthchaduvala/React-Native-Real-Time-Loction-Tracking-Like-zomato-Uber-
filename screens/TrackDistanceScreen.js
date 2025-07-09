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
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
import MapView, { Marker, Polyline } from 'react-native-maps';

import * as Location from 'expo-location';
import API from '../utils/api';
import { haversineDistance } from '../utils/haversine';

export default function TrackDistanceScreen({ route }) {
  const { rideId } = route.params;
  const [rideStatus, setRideStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [myCoords, setMyCoords] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [isDriver, setIsDriver] = useState(false);

  const mapRef = useRef(null);

  const updateLocation = async () => {
    try {
      const [
        { data: rideStatusRes },
        { data: rideDetails },
        { data: me },
      ] = await Promise.all([
        API.get(`ride/status/${rideId}/`),
        API.get(`ride/details/${rideId}/`),
        API.get('user/me/'),
      ]);

      setRideStatus(rideStatusRes.status);
      setIsDriver(me.id === rideDetails.accepted_by);

      const { coords } = await Location.getCurrentPositionAsync({});
      const myLoc = {
        lat: coords.latitude,
        lng: coords.longitude,
      };
      setMyCoords(myLoc);

      await API.post('location/update/', {
        lat: myLoc.lat,
        lng: myLoc.lng,
      });

      const pickupLoc = {
        lat: rideDetails.from_lat,
        lng: rideDetails.from_lng,
      };
      const destinationLoc = {
        lat: rideDetails.to_lat,
        lng: rideDetails.to_lng,
      };

      setPickupCoords(pickupLoc);
      setDestCoords(destinationLoc);

      // Adjust map to show both
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(
          [
            { latitude: myLoc.lat, longitude: myLoc.lng },
            { latitude: pickupLoc.lat, longitude: pickupLoc.lng },
          ],
          {
            edgePadding: { top: 100, bottom: 100, left: 100, right: 100 },
            animated: true,
          }
        );
      }

      // Only driver will control ride state
      if (me.id === rideDetails.accepted_by) {
        if (rideStatusRes.status === 'accepted') {
          const dist = haversineDistance(myLoc, pickupLoc);
          if (dist <= 0.1) {
            await API.post(`ride/start/${rideId}/`);
            setRideStatus('started');
            Alert.alert('✅ Ride Started', 'Passenger picked up');
          }
        } else if (rideStatusRes.status === 'started') {
          const dist = haversineDistance(myLoc, destinationLoc);
          if (dist <= 0.1) {
            await API.post(`ride/complete/${rideId}/`);
            setRideStatus('completed');
            Alert.alert('🏁 Ride Completed', 'You reached the destination');
          }
        }
      }

      setLoading(false);
    } catch (err) {
      console.log('Track error:', err.message);
    }
  };

  useEffect(() => {
    updateLocation();
    const interval = setInterval(updateLocation, 8000);
    return () => clearInterval(interval);
  }, []);

  if (Platform.OS === 'web') {
    return <Text>❌ Tracking not supported on web</Text>;
  }

  if (loading || !myCoords || !pickupCoords) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="blue" />;
  }

  return (
    <View style={styles.container}>
      {/* <Text style={{ padding: 10, fontSize: 16 }}>
        {rideStatus === 'accepted' && `📏 Distance to pickup: ${haversineDistance(myCoords, pickupCoords).toFixed(2)} km`}
        {rideStatus === 'started' && `🏁 Distance to destination: ${haversineDistance(myCoords, destCoords).toFixed(2)} km`}
      </Text> */}

      <Text style={{ padding: 10, fontSize: 16 }}>
        {rideStatus === 'accepted' &&
          `📏 Distance to pickup: ${(
            haversineDistance(myCoords, pickupCoords) * 1000
          ).toFixed(0)} meters`}

        {rideStatus === 'started' &&
          `🏁 Distance to destination: ${haversineDistance(myCoords, destCoords).toFixed(2)} km`}
      </Text>


      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: myCoords.lat || 17.385,
          longitude: myCoords.lng || 78.4867,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Driver location */}
        <Marker
          coordinate={{
            latitude: parseFloat(myCoords.lat),
            longitude: parseFloat(myCoords.lng),
          }}
          title={isDriver ? 'Driver (You)' : 'You'}
        >
          <Text style={{ fontSize: 24 }}>🚗</Text>
        </Marker>

        {/* Pickup location */}
       {/* Pickup (requester) location marker */}
        <Marker
          coordinate={{
            latitude: parseFloat(pickupCoords.lat),
            longitude: parseFloat(pickupCoords.lng),
          }}
          title={isDriver ? 'Rider (Pickup)' : 'You'}
        >
          <Text style={{ fontSize: 20 }}>📍</Text>
        </Marker>


        {/* Destination location */}
        {/* Before pickup: Show line from driver to pickup */}
        {/* Before pickup: Show line from driver to pickup */}
        {rideStatus === 'accepted' && (
          <Polyline
            coordinates={[
              {
                latitude: parseFloat(myCoords.lat),
                longitude: parseFloat(myCoords.lng),
              },
              {
                latitude: parseFloat(pickupCoords.lat),
                longitude: parseFloat(pickupCoords.lng),
              },
            ]}
            strokeColor="blue"
            strokeWidth={3}
          />
        )}

        {/* After pickup: Show line from current to destination */}
        {rideStatus === 'started' && (
          <Polyline
            coordinates={[
              {
                latitude: parseFloat(myCoords.lat),
                longitude: parseFloat(myCoords.lng),
              },
              {
                latitude: parseFloat(destCoords.lat),
                longitude: parseFloat(destCoords.lng),
              },
            ]}
            strokeColor="green"
            strokeWidth={3}
          />
        )}



      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  status: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#f0f0f0',
  },
});
