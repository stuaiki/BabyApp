import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
} from "react-native";
import RootNavigator from "./src/navigation/RootNavigator";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "./src/screens/Login"; // Correct path to LoginScreen
import HomeScreen from "./src/screens/Home";
import CreateAccount from "./src/screens/CreateNewAccount";
import { MainStackParamList } from "../BabyApp/src/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import useBLE from "./useBLE";

const App = () => {
  const { requestPermissions, scanForPeripherals } = useBLE();

  useEffect(() => {
    const initializeBLE = async () => {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        scanForPeripherals(); // Start scanning if permissions are granted
      } else {
        console.log("Bluetooth permissions not granted");
      }
    };

    initializeBLE(); // Run BLE initialization when the app starts
  }, []);

  return (
    <>
      <RootNavigator />
    </>
  );
};

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="CreateNewAccount" component={CreateAccount} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

export default App;
