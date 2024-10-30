import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  TouchableHighlight,
  Alert,
  Button,
} from "react-native";
import { Device } from "react-native-ble-plx";
import { useBluetooth } from "../../BluetoothContext"; // Import useBluetooth from context

const SyncDevice = () => {
  const {
    scanForPeripherals,
    stopScanning,
    allDevices,
    connectToDevice,
    readTemperature,
    isConnected,
    connectedDevice,
    requestPermissions,
    setAllDevices,
    scanning,
    setScanning,
    alertVisible,
    setAlertVisible,
    ensureConnected, // Add ensureConnected
    retryReadTemperature, // Add retryReadTemperature
  } = useBluetooth(); // Use BluetoothContext

  const [temperature, setTemperature] = useState<number | null>(null);

  // Automatically connect and read temperature from the first available device
  useEffect(() => {
    const connectAndReadTemperature = async () => {
      if (allDevices.length > 0) {
        const device = allDevices[0]; // Use the first available device
        
        // Ensure the device is connected before reading temperature
        await ensureConnected(device);

        // Retry reading the temperature with multiple attempts
        const temp = await retryReadTemperature(device);
        if (temp !== null) {
          setTemperature(temp);
        }
      }
    };

    // Run this function to connect and read temperature periodically
    connectAndReadTemperature();
  }, [allDevices, connectToDevice, readTemperature]);

  const handleStartScanning = async () => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) {
      Alert.alert(
        "Permissions Required",
        "Please grant Bluetooth and location permissions."
      );
      return;
    }
    setAllDevices([]); // Clear previously discovered devices
    setScanning(true);
    setAlertVisible(true);
    scanForPeripherals(); // Start scanning

    setTimeout(() => {
      setScanning(false);
      stopScanning();

      if (allDevices.length === 0) {
        setAlertVisible(true); // Show modal if no devices were found
      }
    }, 5000); // Scan for 5 seconds
  };

  const handleConnectDevice = (device: Device) => {
    connectToDevice(device);
    setAlertVisible(false); // Close the modal after selecting the device
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Sync Your Device</Text>

      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.activeDot]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>

      <Image
        source={require("../../assets/carseatRender.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text
        style={[
          styles.connectionStatus,
          { color: isConnected ? "green" : "red" }, // Dynamic color based on connection status
        ]}
      >
        {isConnected
          ? `Connected to: ${connectedDevice?.name || "Device"}`
          : "Not connected"}
      </Text>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleStartScanning}
      >
        <Text style={styles.buttonText}>{"Search Nearby"}</Text>
      </TouchableOpacity>

      {/* Temperature display */}
      <Text style={[styles.temperatureLabel, styles.topLeft]}>
        {temperature !== null ? `${temperature.toFixed(2)}°C` : "Loading..."}
      </Text>

      {/* Custom Modal to show the available devices */}
      <Modal transparent={true} visible={alertVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>
              {allDevices.length === 0
                ? "No device found"
                : "Available Devices"}
            </Text>

            {scanning ? (
              <Button
                title="Stop Scanning"
                onPress={() => setScanning(false)}
              />
            ) : (
              <>
                <FlatList
                  data={allDevices.filter(
                    (device) => device.name || device.localName
                  )}
                  keyExtractor={(device) => device.id}
                  renderItem={({ item }) => (
                    <TouchableHighlight
                      style={styles.deviceItem}
                      underlayColor="#DDD"
                      onPress={() => handleConnectDevice(item)}
                    >
                      <Text style={styles.deviceText}>
                        {item.name || item.localName}
                      </Text>
                    </TouchableHighlight>
                  )}
                />
                <Button title="Close" onPress={() => setAlertVisible(false)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FBFD",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2F3E75",
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D3D3D3",
    marginHorizontal: 8,
  },
  activeDot: {
    backgroundColor: "#FF6F61",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  searchButton: {
    backgroundColor: "#ADD8E6",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  alertText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  deviceItem: {
    padding: 15,
    backgroundColor: "#EEE",
    marginVertical: 5,
    borderRadius: 8,
  },
  deviceText: {
    fontSize: 16,
    textAlign: "center",
  },
  connectionStatus: {
    fontSize: 16,
    marginVertical: 10,
  },
  temperatureLabel: {
    position: "absolute",
    backgroundColor: "#EEF6FF",
    padding: 5,
    borderRadius: 50,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  topLeft: {
    top: 10,
    left: 20,
  },
});

export default SyncDevice;
