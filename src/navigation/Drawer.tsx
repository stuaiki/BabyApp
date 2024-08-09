import React from "react";
import { StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/Home";
import Account from "../screens/Account";
import MonitorSeats from "../screens/MonitorSeats";
import AlertSetting from "../screens/AlertSetting";
import AlertMeWhen from "../screens/AlertMeWhen";
import CustomDrawerContent from "../navigation/CustomDrawerContent ";
import NotifyMeThrough from "../screens/NotifyMeThrough";
import ActiveSafetyAlert from "../screens/ActiveSafetyAlert";
import PeopleToAlert from "../screens/PeopleToAlert";
import NewContact from "../screens/NewContact";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
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
      <Drawer.Screen name="ActiveSafetyAlert" component={ActiveSafetyAlert} />
      <Drawer.Screen
        name="AlertMeWhen"
        component={AlertMeWhen}
        options={{
          drawerItemStyle: styles.disabledItem,
          drawerLabel: "Alert Me When",
        }}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            // Prevent navigation if the item is disabled
            e.preventDefault();
          },
        })}
      />
      <Drawer.Screen
        name="NotifyMeThrough"
        component={NotifyMeThrough}
        options={{
          drawerItemStyle: styles.disabledItem,
          drawerLabel: "Notify Me Through",
        }}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            // Prevent navigation if the item is disabled
            e.preventDefault();
          },
        })}
      />
      <Drawer.Screen
        name="PeopleToAlert"
        component={PeopleToAlert}
        options={{
          drawerItemStyle: styles.disabledItem,
          drawerLabel: "People To Alert",
        }}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            // Prevent navigation if the item is disabled
            e.preventDefault();
          },
        })}
      />
      <Drawer.Screen
        name="NewContact"
        component={NewContact}
        options={{
          drawerItemStyle: styles.disabledItem,
          drawerLabel: "New Contact",
        }}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            // Prevent navigation if the item is disabled
            e.preventDefault();
          },
        })}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  disabledItem: {
    opacity: 0, // makes the item look disabled
  },
});

export default DrawerNavigation;
