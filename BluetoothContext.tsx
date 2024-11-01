import React, { createContext, ReactNode, useEffect, useState } from "react";
import useBLE from "./useBLE"; // Import the useBLE hook
import { Device } from "react-native-ble-plx"; // Import Device type

// Define types for context
interface BluetoothContextProps {
  requestPermissions: () => Promise<boolean>;
  scanForPeripherals: () => void;
  stopScanning: () => void;
  allDevices: Device[]; // Devices scanned
  setAllDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  connectToDevice: (device: Device) => Promise<void>;
  reconnectLastDevice: () => Promise<Device | null>;
  handleConnectDevice: (device: Device) => void;
  readTemperature: (device: Device) => Promise<number | null>;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  disconnectDevice: () => Promise<void>;
  connectedDevice: Device | null;
  setConnectedDevice: React.Dispatch<React.SetStateAction<Device | null>>;
  isScanning: boolean; // State for scanning status
  setIsScanning: React.Dispatch<React.SetStateAction<boolean>>; // Setter for scanning state
  alertVisible: boolean; // Modal visibility state
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Setter for alert visibility
  ensureConnected(device: Device): Promise<void>;
  retryReadTemperature(
    device: Device,
    retries?: number
  ): Promise<number | null>;
  temperature: number | null; // Add temperature here
  setTemperature: React.Dispatch<React.SetStateAction<number | null>>; // Add setTemperature here
}

// Create a context with default values
const BluetoothContext = createContext<BluetoothContextProps | undefined>(
  undefined
);

// Define a provider component that uses the useBLE hook and provides its functionality
export const BluetoothProvider = ({ children }: { children: ReactNode }) => {
  const {
    requestPermissions,
    scanForPeripherals,
    stopScanning,
    allDevices,
    setAllDevices, // Ensure you add this here
    connectToDevice,
    reconnectLastDevice,
    handleConnectDevice,
    readTemperature,
    isConnected,
    disconnectDevice,
    setConnectedDevice,
    connectedDevice,
    setIsConnected,
    ensureConnected, // Add ensureConnected
    retryReadTemperature, // Add retryReadTemperature
  } = useBLE(); // Use the useBLE hook

  const [temperature, setTemperature] = useState<number | null>(null);

  // State to manage Bluetooth scanning status
  const [isScanning, setIsScanning] = useState(false);

  // State to manage modal visibility
  const [alertVisible, setAlertVisible] = useState(false);

  // Initialize BLE on mount
  useEffect(() => {
    const initializeBLE = async () => {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.log("Bluetooth permissions not granted");
      }
    };

    initializeBLE();
  }, []);

  return (
    <BluetoothContext.Provider
      value={{
        requestPermissions,
        scanForPeripherals,
        stopScanning,
        allDevices,
        setAllDevices,
        connectToDevice,
        reconnectLastDevice,
        handleConnectDevice,
        readTemperature,
        isConnected,
        disconnectDevice,
        connectedDevice,
        setIsConnected,
        setConnectedDevice,
        isScanning, // New scanning state here
        setIsScanning, // Control scanning state from context
        alertVisible, // Control alert modal visibility
        setAlertVisible, // Set alert modal visibility
        ensureConnected, // Add ensureConnected
        retryReadTemperature, // Add retryReadTemperature
        temperature, // Provide temperature state
        setTemperature, // Provide setTemperature function
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

// Custom hook to access the Bluetooth context
export const useBluetooth = () => {
  const context = React.useContext(BluetoothContext);
  if (!context) {
    throw new Error("useBluetooth must be used within a BluetoothProvider");
  }
  return context;
};

export default BluetoothContext;
