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
import { sendTemperatureData } from "./src/api/submitData";

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

  const sendTemperatureToAWS = async (temperature: number) => {
    try {
      // Replace 123 and 456 with actual user_id and seat_id
      const user_id = 123;
      const seat_id = 456;
  
      await sendTemperatureData(user_id, seat_id, temperature);
      console.log("Temperature data successfully sent to AWS");
    } catch (error) {
      console.error("Error sending temperature data to AWS:", error);
    }
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
