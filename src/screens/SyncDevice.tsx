import {
  FlatList,
  NativeEventEmitter,
  PermissionsAndroid,
  StyleSheet,
  NativeModules,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Image,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import BleManager from "react-native-ble-manager";
import { TEMP_CHARACTERISTIC_UUID } from "./Bluetooth/BleConstants";
import { useBluetooth } from "../../BluetoothContext";

const SyncDevice = () => {
  const {
    isScanning,
    setIsScanning, // Use if managed in context
    temperature, // Get temperature from context
    setTemperature, // Set temperature in context
    isConnected,
    connectedDevice,
    allDevices,
    setAllDevices,
    setConnectedDevice,
    setIsConnected,
  } = useBluetooth();

  const [bleDevices, setBleDevices] = useState([]);
  const BleManagerModule = NativeModules.BleManager;
  const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    BleManager.start({ showAlert: false }).then(() => {
      console.log("Module initialized");
    });
  }, []);

  useEffect(() => {
    BleManager.enableBluetooth().then(() => {
      console.log("Bluetooth is enabled or confirmed");
    });
    requestPermission();
  }, []);

  useEffect(() => {
    let stopListener = BleManagerEmitter.addListener(
      "BleManagerStopScan",
      () => {
        setIsScanning(false);
        console.log("Scan stopped");
        handleGetConnectedDevices();
      }
    );

    let characteristicValueUpdate = BleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      (data) => {
        console.log("Event BlueManagerDidUpdateValueForCharacteristic", data);
        readCharacteristicFromEvent(data);
      }
    );

    return () => {
      stopListener.remove();
      characteristicValueUpdate.remove();
    };
  }, []);

  const requestPermission = async () => {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  };

  const handleStartScanning = () => {
    setAlertVisible(true);
    setIsScanning(true);
    BleManager.scan([], 5, true)
      .then(() => console.log("Scanning started..."))
      .catch((error) => console.error(error));
  };

  const handleGetConnectedDevices = () => {
    BleManager.getDiscoveredPeripherals().then((result: any) => {
      const filteredDevices = result.filter((device: any) => device.name);
      setAllDevices(filteredDevices);
      setBleDevices(filteredDevices);
      console.log("Discovered peripherals:", result);
    });
  };

  const handleConnectDevice = async (device: any) => {
    try {
      await BleManager.connect(device.id);
      setConnectedDevice(device);
      setIsConnected(true);
      setAlertVisible(false);

      const result = await BleManager.retrieveServices(device.id);
      console.log("Connected to", result);
      onServiceDiscovered(result, device);
    } catch (error) {
      console.error("Connection Error:", error);
    }
  };

  const onServiceDiscovered = (result: any, item: any) => {
    const services = result.services;
    const characteristics = result.characteristics;
    services.forEach((service: any) => {
      const serviceUUID = service.uuid;
      onChangeCharacteristics(serviceUUID, characteristics, item);
    });
  };

  const onChangeCharacteristics = async (
    serviceUUID: any,
    result: any,
    item: any
  ) => {
    for (const characteristic of result) {
      const characteristicUUID = characteristic.characteristic;

      if (characteristicUUID === TEMP_CHARACTERISTIC_UUID) {
        BleManager.startNotification(item.id, serviceUUID, characteristicUUID)
          .then(() => {
            console.log("notification started");
          })
          .catch((error) => {
            console.log("notification error", error);
          });
      }
    }
  };

  const readCharacteristicFromEvent = (data: any) => {
    if (data.characteristic === TEMP_CHARACTERISTIC_UUID) {
      const temperature = byteToNumber(data.value);
      setTemperature(temperature);
      console.log("Temperature:", temperature);
    }
  };

  const byteToNumber = (value: number[]): number => {
    const buffer = new Uint8Array(value);
    const tempValue = (buffer[0] | (buffer[1] << 8)) / 100;
    return parseFloat(tempValue.toFixed(2));
  };

  const renderItem = ({ item }: any) => (
    <View>
      <TouchableOpacity
        style={styles.bleCard}
        onPress={() => handleConnectDevice(item)}
      >
        <Text style={styles.textleft}>{item.name || item.localName}</Text>
      </TouchableOpacity>
    </View>
  );

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
          { color: isConnected ? "green" : "red" },
        ]}
      >
        {isConnected
          ? `Connected to: ${connectedDevice?.name || "Device"}`
          : ""}
      </Text>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleStartScanning}
      >
        <Text style={styles.buttonText}>Search Nearby</Text>
      </TouchableOpacity>

      <Text style={[styles.temperatureLabel, styles.topLeft]}>
        {temperature !== null ? `${temperature}°C` : "Loading..."}
      </Text>

      <Modal transparent={true} visible={alertVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>
              {isScanning ? "Searching..." : "Available Devices"}
            </Text>

            {isScanning ? (
              <Button
                title="Stop Scanning"
                onPress={() => setIsScanning(false)}
              />
            ) : (
              <>
                <FlatList
                  data={bleDevices}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
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
  bleCard: {
    width: "250%",
    padding: 10,
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: "lightblue",
    elevation: 5,
    borderRadius: 5,
  },
  textleft: {
    textAlign: "center",
  },
});

export default SyncDevice;
