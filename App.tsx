import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  NativeEventEmitter,
  NativeModules,
} from "react-native";
import RootNavigator from "./src/navigation/RootNavigator";
import { BluetoothProvider, useBluetooth } from "./BluetoothContext"; // Import BluetoothProvider
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TEMP_CHARACTERISTIC_UUID } from "../BabyApp/src/screens/Bluetooth/BleConstants";

const TemperatureNotifier = () => {
  const {
    allDevices,
    isConnected,
    connectedDevice,
    setTemperature,
    // sendTemperatureToAWS,
  } = useBluetooth();

  const [temperature, setTemperatureLocal] = useState<number | null>(null);

  const BleManagerModule = NativeModules.BleManager;
  const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  const connectAndReadTemperature = async () => {
    try {
      const device = connectedDevice || allDevices[0];
      if (device) {
        subscribeToCharacteristicUpdates();
      }
    } catch (error) {
      console.error("Error connecting or reading temperature:", error);
    }
  };

  useEffect(() => {
    connectAndReadTemperature();

    return () => {
      BleManagerEmitter.removeAllListeners(
        "BleManagerDidUpdateValueForCharacteristic"
      );
    };
  }, [allDevices, connectedDevice]);

  const subscribeToCharacteristicUpdates = () => {
    BleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      handleCharacteristicUpdate
    );
  };

  const handleCharacteristicUpdate = (data: {
    characteristic: string;
    value: number[];
  }) => {
    if (data.characteristic === TEMP_CHARACTERISTIC_UUID) {
      const temperatureValue = byteToNumber(data.value);
      setTemperatureLocal(temperatureValue);
      setTemperature(temperatureValue);
    }
  };

  const byteToNumber = (value: number[]): number => {
    const buffer = new Uint8Array(value);
    const tempValue = (buffer[0] | (buffer[1] << 8)) / 100;
    return parseFloat(tempValue.toFixed(2));
  };

  useEffect(() => {
    if (isConnected && temperature !== null) {
      console.log("New temperature value:", temperature);

      // Notify the user
      // Alert.alert(
      //   "Temperature Update",
      //   `Current Temperature: ${temperature}°C`
      // );

      // Optionally send the temperature to AWS
      // sendTemperatureToAWS(temperature);
    }
  }, [temperature, isConnected]);

  return null;
};

const sendDataToRDS = async (bluetoothData: string): Promise<void> => {
  try {
    const response = await fetch(
      "https://your-api-gateway-endpoint.amazonaws.com/production",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bluetoothData, // The data collected from the Bluetooth device
          timestamp: new Date().toISOString(), // Add a timestamp if needed
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send data to Lambda");
    }

    const result = await response.json();
    console.log("Data sent successfully:", result);
    Alert.alert("Success", "Data sent to the server!");
  } catch (error) {
    console.error("Error sending data:", error);
    Alert.alert("Error", "Failed to send data.");
  }
};

const App = () => {
  return (
    // Wrap the app in BluetoothProvider to provide BLE functionality globally
    <BluetoothProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootNavigator />
        <TemperatureNotifier />
      </GestureHandlerRootView>
    </BluetoothProvider>
  );
};

export default App;
