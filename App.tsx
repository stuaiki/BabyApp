import React from "react";
import { View, Text } from "react-native";
import RootNavigator from "./src/navigation/RootNavigator";
import { BluetoothProvider } from "./BluetoothContext"; // Import BluetoothProvider
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => {
  return (
    // Wrap the app in BluetoothProvider to provide BLE functionality globally
    <BluetoothProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootNavigator />
      </GestureHandlerRootView>
    </BluetoothProvider>
  );
};

export default App;
