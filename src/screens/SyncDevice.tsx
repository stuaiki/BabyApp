import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  TouchableHighlight,
  Alert,
} from "react-native";
import useBLE from "./../../useBLE"; // Assuming useBLE hook is in the same directory
import { Device } from "react-native-ble-plx"; // Import Device type

const SyncDevice = () => {
  const {
    scanForPeripherals,
    stopScanning,
    allDevices,
    connectToDevice,
    requestPermissions,
    setAllDevices,
  } = useBLE();
  const [scanning, setScanning] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [scanResultMessage, setScanResultMessage] = useState(
    "Scanning for devices..."
  );

  const handleStartScanning = async () => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) {
      Alert.alert(
        "Permissions Required",
        "Please grant Bluetooth and location permissions."
      );
      return;
    }
    setAllDevices([]);
    setScanning(true);
    setAlertVisible(true);
    setScanResultMessage("Scanning for devices...");
    scanForPeripherals();

    setTimeout(() => {
      setScanning(false);
      stopScanning();

      if (allDevices.length === 0) {
        setScanResultMessage("No device was found.");
      } else {
        setAlertVisible(true); // Show modal with device list if devices are found
      }
    }, 15000); // Scan for 15 seconds
  };

  const handleStopScanning = () => {
    setScanning(false);
    stopScanning();
    setScanResultMessage("Scanning stopped.");
  };

  const closeAlert = () => {
    setAlertVisible(false);
    setScanResultMessage("Scanning for devices...");
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

      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleStartScanning}
      >
        <Text style={styles.buttonText}>{"Search Nearby"}</Text>
      </TouchableOpacity>

      {/* Custom Modal to show the available devices */}
      <Modal transparent={true} visible={alertVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>
              {allDevices.length === 0
                ? scanResultMessage
                : "Available Devices"}
            </Text>

            {scanning ? (
              <Button title="Stop Scanning" onPress={handleStopScanning} />
            ) : (
              <>
                {/* List available devices in the modal */}
                <FlatList
                  data={allDevices.filter(
                    (device) => device.name || device.localName
                  )} // Filter only named devices
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
                <Button title="Close" onPress={closeAlert} />
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
});

export default SyncDevice;
