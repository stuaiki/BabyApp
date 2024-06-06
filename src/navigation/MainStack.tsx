import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainStackParamList } from "../types/navigation";
import DrawerNavigation from "./Drawer";
import Splash from "../screens/Splash";

//import screens here
import Home from "../screens/Home";
import Login from "../screens/Login";
import CreateNewAccount from "../screens/CreateNewAccount";
import Account from "../screens/Account";
import MonitorSeats from "../screens/MonitorSeats";

const Stack = createNativeStackNavigator<MainStackParamList>();

//MainStack
const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Drawer"
    >
      <Stack.Screen name="Drawer" component={DrawerNavigation} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="MonitorSeats" component={MonitorSeats} />
      <Stack.Screen name="Account" component={Account} />
    </Stack.Navigator>
  );
};

export default MainStack;

const styles = StyleSheet.create({
  drawercolor: {
    backgroundColor: "#e5f4ff",
  },
});
