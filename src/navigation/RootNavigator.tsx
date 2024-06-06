import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./MainStack";
import AuthenticationStack from "./AuthorizationStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigation from "./Drawer";

const RootStack = createNativeStackNavigator();

// This is root navigator. put the root that need to be in screens
const RootNavigator = () => {
  // This logic could be replaced with a check for user authentication status
  const userLoggedIn = false; // Placeholder for actual auth check

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Auth" component={AuthenticationStack} />
        <RootStack.Screen name="Main" component={MainStack} />
        <RootStack.Screen name="Drawer" component={DrawerNavigation} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default RootNavigator;

const styles = StyleSheet.create({});
