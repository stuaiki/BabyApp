import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/Home";
import Login from "../screens/Login";
import CreateAccount from "../screens/CreateNewAccount";
import CustomDrawerContent from "./CustomDrawerContent ";
import { BackHandler } from "react-native";
import Splash from "../screens/Splash";
import Account from "../screens/Account";
import MonitorSeats from "../screens/MonitorSeats";
import AlertSetting from "../screens/AlertSetting";

// contents inside of drawaer
const DrawerNavigation = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#e5f4ff", // Drawer background color
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="MonitorSeats" component={MonitorSeats} />
      <Drawer.Screen name="Account" component={Account} />
      <Drawer.Screen name="AlertSetting" component={AlertSetting} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
