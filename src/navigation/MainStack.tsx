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
import AlertSetting from "../screens/AlertSetting";
import AlertMeWhen from "../screens/AlertMeWhen";
import NotifyMeThrough from "../screens/NotifyMeThrough";
import ActiveSafetyAlert from "../screens/ActiveSafetyAlert";
import PeopleToAlert from "../screens/PeopleToAlert";
import NewContact from "../screens/NewContact";

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
      <Stack.Screen name="AlertSetting" component={AlertSetting} />
      <Stack.Screen name="AlertMeWhen" component={AlertMeWhen} />
      <Stack.Screen name="NotifyMeThrough" component={NotifyMeThrough} />
      <Stack.Screen name="ActiveSafetyAlert" component={ActiveSafetyAlert} />
      <Stack.Screen name="PeopleToAlert" component={PeopleToAlert} />
      <Stack.Screen name="NewContact" component={NewContact} />
    </Stack.Navigator>
  );
};

export default MainStack;

const styles = StyleSheet.create({
  drawercolor: {
    backgroundColor: "#e5f4ff",
  },
});
