/* eslint-diable no-bitwise*/

import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform, Alert } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

const bleManager = new BleManager();
interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  stopScanning(): void;
  allDevices: Device[];
  connectToDevice(device: Device): Promise<void>;
  handleConnectDevice(device: Device): void;
  setAllDevices: React.Dispatch<React.SetStateAction<Device[]>>;
}

function useBLE(): BluetoothLowEnergyApi {
  const [allDevices, setAllDevices] = useState<Device[]>([]);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const connectToDevice = async (device: Device) => {
    try {
      await device.connect();
      console.log("Connected to device:", device.name);
      await device.discoverAllServicesAndCharacteristics();
      // You can now interact with the device's services and characteristics
    } catch (error) {
      console.log("Connection error:", error);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  // const requestPermissions = async () => {
  //   if (Platform.OS === "android") {
  //     if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: "Location Permission",
  //           message: "Bluetooth Low Energy requires Location",
  //           buttonPositive: "OK",
  //         }
  //       );
  //       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //         Alert.alert(
  //           "Permission Denied",
  //           "Location permission is required for Bluetooth scanning."
  //         );
  //       }
  //       return granted === PermissionsAndroid.RESULTS.GRANTED;
  //     } else {
  //       const isAndroid31PermissionsGranted = await requestAndroid31Permissions();
  //       if (!isAndroid31PermissionsGranted) {
  //         Alert.alert(
  //           "Permission Denied",
  //           "Bluetooth and location permissions are required for scanning."
  //         );
  //       }
  //       return isAndroid31PermissionsGranted;
  //     }
  //   } else {
  //     return true; // Assuming iOS permissions are handled properly elsewhere
  //   }
  // };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const handleConnectDevice = (device: Device) => {
    Alert.alert(
      "Connect to Device",
      `Do you want to connect to ${device.name || device.localName}?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Connection canceled"),
          style: "cancel",
        },
        {
          text: "Connect",
          onPress: () => connectToDevice(device), // Proceed with connecting to the device
        },
      ],
      { cancelable: true }
    );
  };

  const scanForPeripherals = () => {
    console.log("Scanning for Bluetooth devices...");
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan error:", error);
        return;
      }

      // Only include your specific device, replace "YourDeviceName" with the name of your device
      // if (
      //   device &&
      //   (device.localName === "YourDeviceName" ||
      //     device.name === "YourDeviceName")
      // )
      if (device) {
        console.log("Found device:", device.name);
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };

  const stopScanning = () => {
    bleManager.stopDeviceScan();
  };

  return {
    scanForPeripherals,
    requestPermissions,
    stopScanning,
    allDevices,
    connectToDevice,
    handleConnectDevice,
    setAllDevices
  };
}

export default useBLE;
