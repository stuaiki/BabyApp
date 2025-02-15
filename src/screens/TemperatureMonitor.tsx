import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  NativeEventEmitter,
  NativeModules,
} from "react-native";
import { useBluetooth } from "../../BluetoothContext"; // Import useBluetooth from context
import { TEMP_CHARACTERISTIC_UUID } from "./Bluetooth/BleConstants";
import { FAN_CONTROL_UUID } from "./Bluetooth/BleConstants";
import BleManager from "react-native-ble-manager";
import { SERVICE_UUID } from "./Bluetooth/BleConstants";

const TemperatureMonitor = () => {
  const {
    allDevices,
    isConnected,
    connectedDevice,
    setTemperature,
    setIsConnected,
  } = useBluetooth();

  const [temperature, setTemperatureLocal] = useState<number | null>(null);
  const [isAuto, setIsAuto] = useState(false); // 🔴 Track Auto button state
  const [isOn, setIsOn] = useState(false); // 🔴 Track On/Off button state

  const BleManagerModule = NativeModules.BleManager;
  const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  const connectAndReadTemperature = async () => {
    try {
      const device = connectedDevice || allDevices[0];
      if (device) {
        subscribeToCharacteristicUpdates();
      } else {
        console.error("No device found to connect and read temperature.");
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

  const disconnect = async () => {
    try {
      if (connectedDevice) {
        await BleManager.disconnect(connectedDevice.id);
        console.log("Disconnected from device");
        setIsConnected(false);
      } else {
        console.warn("No device connected to disconnect.");
      }
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const manualControl = async (command: string) => {
    try {
      if (!connectedDevice) {
        console.warn("No connected device found.");
        return;
      }

      let finalCommand = command;

      if (command === "Auto") {
        if (isAuto) {
          finalCommand = "Off"; // If Auto is ON, clicking turns it OFF
          setIsAuto(false);
        } else {
          finalCommand = "Auto"; // If Auto is OFF, clicking turns it ON
          setIsAuto(true);
        }
      } else if (command === "On") {
        if (isOn) {
          finalCommand = "Off"; // If it's already ON, turn it OFF
          setIsOn(false);
        } else {
          finalCommand = "On"; // If it's OFF, turn it ON
          setIsOn(true);
        }
      }

      const commandBytes = new TextEncoder().encode(finalCommand);
      console.log(
        `Sending command: ${finalCommand} to UUID: ${FAN_CONTROL_UUID}`
      );

      await BleManager.write(
        connectedDevice.id,
        SERVICE_UUID,
        FAN_CONTROL_UUID,
        Array.from(commandBytes)
      );

      console.log("Command sent successfully!");
    } catch (error) {
      console.error("Failed to send command:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.nameText}>Alexa Rose</Text>
      {/* <Text style={styles.statusText}>Baby in seat</Text> */}

      <Text
        style={[
          styles.connectionStatus,
          { color: isConnected ? "green" : "red" },
        ]}
      >
        {isConnected ? (
          <Text style={{ fontWeight: "bold" }}>Baby in seat</Text>
        ) : (
          "Not connected"
        )}
      </Text>

      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/carseatRender.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={[styles.temperatureLabel, styles.bottomRight]}>
          {temperature !== null ? (
            `${temperature}°C`
          ) : (
            <Text style={{ fontSize: 18.5 }}>Loading...</Text>
          )}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 20 }}>
        {/* 🔴 Auto Button that Changes Color */}
        <TouchableOpacity
          style={[
            styles.searchButton,
            { backgroundColor: isAuto ? "#EE4B2B" : "#ADD8E6" }, // 🔴 Red when Auto is ON, Blue when OFF
          ]}
          onPress={() => manualControl("Auto")}
        >
          <Text style={styles.buttonText}>
            {isAuto ? "Auto" : "Auto"} {/* 🔄 Toggle text */}
          </Text>
        </TouchableOpacity>

        {/* Toggle Button for On/Off */}
        <TouchableOpacity
          style={[
            styles.searchButton,
            { backgroundColor: isOn ? "#EE4B2B" : "#ADD8E6" }, // Toggle color based on On state
          ]}
          onPress={() => manualControl("On")}
        >
          <Text style={styles.buttonText}>
            {isOn ? "Turn OFF" : "Turn ON"} {/* Toggle text */}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Disconnect Button
      {isConnected ? (
        <TouchableOpacity style={styles.disconnectButton} onPress={disconnect}>
          <Text style={styles.disconnectButtonText}>Disconnect</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={connectAndReadTemperature}
        >
          <Text style={styles.disconnectButtonText}>Reconnect</Text>
        </TouchableOpacity>
      )} */}
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
    position: "relative",
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  temperatureLabel: {
    position: "absolute",
    backgroundColor: "#FFD580",
    padding: 10,
    borderRadius: 50,
    textAlign: "right",
    fontSize: 22,
    fontWeight: "bold",
    width: 105,
    height: 50,
  },
  bottomRight: {
    bottom: -30,
    right: -5,
  },
  searchButton: {
    backgroundColor: "#ADD8E6",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
    bottom: -10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#ADD8E6",
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
  disconnectButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  disconnectButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TemperatureMonitor;
