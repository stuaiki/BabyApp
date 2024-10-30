import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { useBluetooth } from '../../BluetoothContext'; // Import useBluetooth from context

const TemperatureMonitor = () => {
  // Access BLE functionality via the context
  const {
    allDevices,
    connectToDevice,
    readTemperature,
    isConnected,
    connectedDevice
  } = useBluetooth();

  const [temperature, setTemperature] = useState<number | null>(null);

  // Example: Connect to a device and read temperature when component mounts
  useEffect(() => {
    const connectAndReadTemperature = async () => {
      // Example: Automatically connecting to the first available device
      if (allDevices.length > 0) {
        const device = allDevices[0]; // For example, use the first available device
        await connectToDevice(device);
        const temp = await readTemperature(device);
        if (temp !== null) {
          setTemperature(temp);
        }
      }
    };

    connectAndReadTemperature();
  }, [allDevices, connectToDevice, readTemperature]);

  return (
    <View style={styles.container}>
      <Text style={styles.nameText}>Alexa Rose</Text>
      <Text style={styles.statusText}>Baby in seat</Text>

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

      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/carseatRender.png")} // Replace with your image
          style={styles.image}
          resizeMode="contain"
        />

        {/* Display the temperature values */}
        <Text style={[styles.temperatureLabel, styles.topLeft]}>
          {temperature !== null ? `${temperature.toFixed(2)}°C` : "Loading..."}
        </Text>
        <Text style={[styles.temperatureLabel, styles.topRight]}>
          {temperature !== null ? `${temperature.toFixed(2)}°C` : "Loading..."}
        </Text>
        <Text style={[styles.temperatureLabel, styles.bottomLeft]}>
          {temperature !== null ? `${temperature.toFixed(2)}°C` : "Loading..."}
        </Text>
      </View>

      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.buttonText}>Adjust Air Flow</Text>
      </TouchableOpacity>

      <View>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FBFD", // Background color similar to the provided design
  },
  nameText: {
    color: "#5A6275",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statusText: {
    color: "green",
    fontSize: 18,
    marginBottom: 20,
  },
  imageContainer: {
    position: "relative", // Enables absolute positioning for temperature labels
    width: 300, // Adjust according to your image size
    height: 300, // Adjust according to your image size
    marginBottom: 40,
  },
  image: {
    width: "100%",
    height: "100%",
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
  topRight: {
    top: 30,
    right: 30,
  },
  bottomLeft: {
    bottom: 20,
    left: 30,
  },
  searchButton: {
    backgroundColor: "#ADD8E6", // Light blue color for the button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#ADD8E6", // Light blue color for the button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  connectionStatus: {
    fontSize: 16,
    marginVertical: 10,
  },
});

export default TemperatureMonitor;
