// // App.js

// // App.js
// import React, { useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import LoginScreen from './screens/LoginScreen';
// import RegisterScreen from './screens/RegisterScreen';
// import RideRequestScreen from './screens/RideRequestScreen';
// import AcceptRideScreen from './screens/AcceptRideScreen';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {isLoggedIn ? (
//           <>
//             <Stack.Screen name="RideRequest">
//               {(props) => <RideRequestScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
//             </Stack.Screen>
//             <Stack.Screen name="AcceptRide" component={AcceptRideScreen} />
//           </>
//         ) : (
//           <>
//             <Stack.Screen name="Login">
//               {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
//             </Stack.Screen>
//             <Stack.Screen name="Register">
//               {(props) => <RegisterScreen {...props} />}
//             </Stack.Screen>
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RideRequestScreen from './screens/RideRequestScreen';
import AcceptRideScreen from './screens/AcceptRideScreen';
import TrackDistanceScreen from './screens/TrackDistanceScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="RideRequest">
              {(props) => <RideRequestScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="AcceptRide">
              {(props) => <AcceptRideScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="TrackDistance" component={TrackDistanceScreen} /> {/* ✅ ADD THIS */}
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
