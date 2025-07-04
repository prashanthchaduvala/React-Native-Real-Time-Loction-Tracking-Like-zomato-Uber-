import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text } from 'react-native';

// Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RideRequestScreen from './screens/RideRequestScreen';
import AcceptRideScreen from './screens/AcceptRideScreen';
import TrackDistanceScreen from './screens/TrackDistanceScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function LogoutScreen({ setIsLoggedIn }) {
  React.useEffect(() => {
    setIsLoggedIn(false); // Clears login state
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Logging out...</Text>
    </View>
  );
}

function AppDrawer({ setIsLoggedIn }) {
  return (
    <Drawer.Navigator initialRouteName="RideRequest">
      <Drawer.Screen
        name="RideRequest"
        options={{ title: 'Request a Ride' }}
      >
        {(props) => <RideRequestScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="AcceptRide"
        component={AcceptRideScreen}
        options={{ title: 'Accept Ride' }}
      />

      <Drawer.Screen
        name="Logout"
        options={{ title: 'Logout' }}
      >
        {(props) => <LogoutScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home">
              {() => <AppDrawer setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="TrackDistance" component={TrackDistanceScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
