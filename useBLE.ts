import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform, Alert } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExpoDevice from "expo-device";

const bleManager = new BleManager();

const LAST_CONNECTED_DEVICE_KEY = "lastConnectedDeviceId";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  stopScanning(): void;
  allDevices: Device[];
  connectedDevice: Device | null;
  setConnectedDevice: React.Dispatch<React.SetStateAction<Device | null>>;
  connectToDevice(device: Device): Promise<void>;
  reconnectLastDevice(): Promise<Device | null>;
  disconnectDevice(): Promise<void>;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  handleConnectDevice(device: Device): void;
  setAllDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  readTemperature(device: Device): Promise<number | null>;
  ensureConnected(device: Device): Promise<void>;
  retryReadTemperature(device: Device, retries?: number): Promise<number | null>;
}


function useBLE(): BluetoothLowEnergyApi {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null); // Track connected device
  const [temperature, setTemperature] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    setIsConnected(connectedDevice !== null);
  }, [connectedDevice]);

  // Store the last connected device's ID in AsyncStorage
  const storeLastConnectedDevice = async (device: Device) => {
    try {
      await AsyncStorage.setItem(LAST_CONNECTED_DEVICE_KEY, device.id);
      console.log("Stored last connected device ID:", device.id);
    } catch (error) {
      console.error("Failed to store last connected device:", error);
    }
  };

  // Retrieve the last connected device ID from AsyncStorage
  const getLastConnectedDeviceId = async (): Promise<string | null> => {
    try {
      const deviceId = await AsyncStorage.getItem(LAST_CONNECTED_DEVICE_KEY);
      return deviceId;
    } catch (error) {
      console.error("Failed to retrieve last connected device ID:", error);
      return null;
    }
  };

  // Function to read temperature from a connected device
  const readTemperature = async (device: Device): Promise<number | null> => {
    try {
      if (!(await device.isConnected())) {
        console.error("Device is not connected.");
        return null;
      }

      await device.discoverAllServicesAndCharacteristics();

      const services = await device.services();
      const service = services.find(
        (s) => s.uuid === "0000181a-0000-1000-8000-00805f9b34fb"
      );

      if (!service) {
        console.error("Environmental Sensing Service not found.");
        return null;
      }

      const characteristics = await service.characteristics();
      const temperatureCharacteristic = characteristics.find(
        (c) => c.uuid === "00002a6e-0000-1000-8000-00805f9b34fb"
      );

      if (!temperatureCharacteristic) {
        console.error("Temperature characteristic not found.");
        return null;
      }

      // Read the characteristic value
      const characteristicValue = await temperatureCharacteristic.read();
      const base64Value = characteristicValue.value;

      if (base64Value) {
        const buffer = Buffer.from(base64Value, "base64");

        // BLE temperature is usually a signed 16-bit integer in units of 0.01°C
        const temperatureRaw = buffer.readInt16LE(0);

        // Convert the raw value to actual temperature in Celsius
        const temperature = temperatureRaw / 100;

        console.log("Temperature:", temperature);

        return temperature;
      } else {
        console.error("Error: Characteristic value is null.");
        return null;
      }
    } catch (error) {
      console.error("Error reading temperature characteristic:", error);
      return null;
    }
  };

  const ensureConnected = async (device: Device) => {
    if (!(await device.isConnected())) {
      console.log("Device is not connected, attempting to reconnect...");
      await connectToDevice(device); // Use your connectToDevice function to reconnect
    }
  };

  const retryReadTemperature = async (
    device: Device,
    retries: number = 3
  ): Promise<number | null> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      const temp = await readTemperature(device);
      if (temp !== null) {
        return temp; // Success
      }
      console.warn(`Retrying temperature read (attempt ${attempt + 1})...`);
    }
    console.error("Failed to read temperature after multiple attempts.");
    return null;
  };

  // Request Android 31+ specific Bluetooth permissions
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

  // Connect to a BLE device
  const connectToDevice = async (device: Device) => {
    try {
      if (await device.isConnected()) {
        console.log("Device is already connected");
        setConnectedDevice(device);
        return;
      }

      await device.connect();
      console.log("Connected to device:", device.name || device.localName);

      await device.discoverAllServicesAndCharacteristics();
      console.log("Discovered services and characteristics");

      // Now call discoverServicesAndCharacteristics
      await discoverServicesAndCharacteristics(device);

      setConnectedDevice(device); // Update connected device state
      storeLastConnectedDevice(device); // Store device for future reconnections
    } catch (error) {
      console.log("Connection error:", error);
    }
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const connectAndReadTemperature = async () => {
    try {
      // Example: Automatically connecting to the first available device
      if (allDevices.length > 0) {
        const device = allDevices[0]; // For example, use the first available device
        await connectToDevice(device);

        // Add a delay to ensure the device is ready
        await delay(1000); // Delay for 1 second before reading

        // Now read the temperature
        const temp = await readTemperature(device);
        if (temp !== null) {
          setTemperature(temp);
        }
      }
    } catch (error) {
      console.error("Error in connectAndReadTemperature:", error);
    }
  };

  const discoverServicesAndCharacteristics = async (device: Device) => {
    try {
      await device.discoverAllServicesAndCharacteristics();

      const services = await device.services();
      for (const service of services) {
        console.log(`Service UUID: ${service.uuid}`);

        const characteristics = await service.characteristics();
        for (const characteristic of characteristics) {
          console.log(`Characteristic UUID: ${characteristic.uuid}`);

          // Optionally, attempt to read each characteristic
          try {
            const value = await characteristic.read();
            console.log(`Characteristic Value (Base64): ${value.value}`);
          } catch (error) {
            console.log(`Error reading characteristic: ${characteristic.uuid}`);
          }
        }
      }
    } catch (error) {
      console.error("Error discovering services and characteristics:", error);
    }
  };

  useEffect(() => {
    const connectAndReadTemperature = async () => {
      try {
        if (allDevices.length > 0) {
          const device = allDevices[0]; // Use the first available device
          await connectToDevice(device); // Connect to the device

          await delay(1000); // Ensure a 1-second delay before reading

          const temp = await readTemperature(device); // Attempt to read temperature
          if (temp !== null) {
            setTemperature(temp); // Set temperature state if successful
          }
        }
      } catch (error) {
        console.error("Error in connectAndReadTemperature:", error);
      }
    };

    connectAndReadTemperature();
  }, [allDevices]);

  // Disconnect from the current device
  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null); // Clear connected device state
        console.log("Disconnected from device");
      } catch (error) {
        console.error("Error disconnecting from device:", error);
      }
    }
  };

  // Request permissions for BLE
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

  // Reconnect to the last connected device
  const reconnectLastDevice = async (): Promise<Device | null> => {
    const lastDeviceId = await getLastConnectedDeviceId();
    if (lastDeviceId) {
      console.log(`Attempting to reconnect to last device: ${lastDeviceId}`);
      try {
        const devices = await bleManager.devices([lastDeviceId]);
        if (devices.length > 0) {
          const device = devices[0];
          await connectToDevice(device); // Reconnect to the last known device
          return device;
        }
      } catch (error) {
        console.error("Error reconnecting to last device:", error);
      }
    }
    return null;
  };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  // Handle device connection via user interaction
  const handleConnectDevice = (device: Device) => {
    const deviceName = device.name || device.localName || "Unnamed Device";
    Alert.alert(
      "Connect to Device",
      `Do you want to connect to ${deviceName}?`,
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

  // Scan for BLE devices
  const scanForPeripherals = () => {
    console.log("Scanning for Bluetooth devices...");
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan error:", error);
        return;
      }

      if (device) {
        const deviceName = device.name || device.localName || "Unnamed Device";
        console.log("Found device:", deviceName);

        setAllDevices((prevState: Device[]) => {
          if (!isDuplicateDevice(prevState, device)) {
            const updatedDevices = [...prevState, device];
            console.log("Devices in list:", updatedDevices.length);
            return updatedDevices;
          }
          return prevState;
        });
      }
    });
  };

  // Stop scanning for BLE devices
  const stopScanning = () => {
    bleManager.stopDeviceScan();
  };

  return {
    scanForPeripherals,
    requestPermissions,
    stopScanning,
    allDevices,
    setAllDevices,
    connectToDevice,
    reconnectLastDevice,
    disconnectDevice,
    isConnected, // Add this flag to track if connected
    handleConnectDevice,
    readTemperature,
    connectedDevice,
    setConnectedDevice,
    ensureConnected,
    retryReadTemperature,
    setIsConnected,
  };
}

export default useBLE;
