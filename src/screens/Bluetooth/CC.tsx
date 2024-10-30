import {
    FlatList,
    Image,
    NativeEventEmitter,
    NativeModules,
    PermissionsAndroid,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import BleManager from "react-native-ble-manager";
  import { TEMPERATURE_UUID, SERVICE_UUID } from "./BleConstants";
  
  interface Device {
    id: string;
    name: string;
    // Add any other properties needed for your device object
  }
  
  const ConnectDevice = () => {
    const [bluetoothDevices, setBluetoothDevices] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const BleManagerModule = NativeModules.BleManager;
    const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
    const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
    const [temperature, setTemperature] = useState<string | null>(null);
    const [humidity, setHumidity] = useState<string | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [status, setStatus] = useState<string>("Lock");
    useEffect(() => {
      BleManager.enableBluetooth()
        .then(() => {
          console.log("Bluetooth is turned on!");
          requestPermission();
        })
        .catch((error) => {
          console.log("The user refuse to enable bluetooth");
        });
  
      return () => {};
    }, []);
  
    useEffect(() => {
      BleManager.start({ showAlert: false }).then(() => {
        console.log("BleManager initialized");
      });
    }, []);
  
    useEffect(() => {
      let stop;
    });
  
    const requestPermission = async () => {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        // startScanning()
      ]);
  
      if (granted) {
        startScanning();
      }
    };
  
    const startScanning = () => {
      if (!isScanning) {
        BleManager.scan([], 10, false)
          .then(() => {
            console.log("Scan started.....");
            setIsScanning(true);
          })
          .catch((error: any) => {
            console.error(error);
          });
      }
    };
  
    useEffect(() => {
      let stopListener = BleManagerEmitter.addListener(
        "BleManagerStopScan",
        () => {
          setIsScanning(false);
          handleGetConnectedDevices();
          console.log("Scan is stopped");
        }
      );
  
      let disconnected = BleManagerEmitter.addListener(
        "BleManagerDisconnectPeripheral",
        (peripheral) => {
          console.log("Disconnected Device", peripheral);
        }
      );
  
      let characteristicValueUpdate = BleManagerEmitter.addListener(
        "BleManagerDidUpdateValueForCharacteristic",
        (data) => {
          // Handle received data
          // bleServices.onCharacteristicChanged(data);
          console.log("Event BlueManagerDidUpdateValueForCharacteristic", data);
  
          readCharacteristicFromEvent(data);
        }
      );
      let BleManagerDidUpdateState = BleManagerEmitter.addListener(
        "BleManagerDidUpdateState",
        (data) => {
          // Handle received data
          console.log("BleManagerDidUpdateState Event!", data);
        }
      );
  
      return () => {
        stopListener.remove();
        disconnected.remove();
        characteristicValueUpdate.remove();
        BleManagerDidUpdateState.remove();
      };
    }, [bluetoothDevices]);
  
    const handleGetConnectedDevices = () => {
      BleManager.getDiscoveredPeripherals().then((result: any) => {
        if (result.length == 0) {
          console.log("No connected bluetooth devices");
          startScanning();
        } else {
          // console.log("RESULTS", JSON.stringify(result));
          const allDevices = result.filter((item: any) => item.name !== null); // Corrected
          setBluetoothDevices(allDevices);
        }
      });
    };
  
    const onConnect = async (item: Device) => {
      try {
        await BleManager.connect(item.id);
        setCurrentDevice(item);
  
        const result = await BleManager.retrieveServices(item.id);
        console.log("Device services retrieved:", result);
  
        // Start reading temperature data after connecting
        readCharacteristic(TEMPERATURE_UUID, SERVICE_UUID, item);
      } catch (error) {
        console.log("Connection error:", error);
      }
    };
  
    const onServicesDiscovered = (result: any, item: any) => {
      const services = result.services;
      const characteristics = result.characteristics;
  
      services.forEach((service: any) => {
        const serviceUUID = service.uuid;
        onChangeCharacteristics(serviceUUID, characteristics, item);
      });
    };
  
    const onChangeCharacteristics = (
      serviceUUID: any,
      result: any,
      item: any
    ) => {
      console.log("SERVICE UUIDS:::", serviceUUID);
      // console.log("RESULT", result)
      result.forEach((characteristic: any) => {
        const characteristicUUID = characteristic.characteristic;
        BleManager.startNotification(item.id, serviceUUID, characteristicUUID)
          .then(() => {
            console.log("Notification started for characteristic:");
          })
          .catch((error) => {
            console.error("Notification error:", error);
          });
      });
    };
  
    const readCharacteristicFromEvent = (data: any) => {
      const { characteristic, value } = data;
  
      if (characteristic === TEMPERATURE_UUID) {
        const temperature = byteToString(value);
        setTemperature(temperature);
        console.log("Temperature:", temperature);
      }
    };
  
    const byteToString = (bytes: any) => {
      return String.fromCharCode(...bytes);
    };
  
    const readCharacteristic = (
      characteristicUUID: any,
      serviceUUID: any,
      item: any
    ) => {
      console.log("CURRENT DEVICE ID:::", item?.id);
  
      BleManager.read(item.id, serviceUUID, characteristicUUID)
        .then((result) => {
          if (characteristicUUID === "d12c02c0-d1e0-de69-12c1-abacdeb2cd2c") {
            console.log("CHARACTERISTIC " + characteristicUUID, result);
            extractDeviceName(result);
          }
        })
        .catch((error) => {
          console.error("Error during BLE read:", error);
        });
    };
  
    const extractDeviceName = (valueArray: any) => {
      const deviceName = bytesToString(valueArray);
      console.log("DEVICE NAME:::", deviceName);
    };
  
    const bytesToString = (bytes: any) => {
      return String.fromCharCode(...bytes);
    };
  
    const calculateDistance = (rssi: number) => {
      const txPower = -59; // Adjust this value based on your device's TX power
      if (rssi === 0) {
        return -1.0;
      }
  
      const ratio = (rssi * 1.0) / txPower;
  
      console.log("RATIO::::", ratio);
      if (ratio < 1.0) {
        console.log("RATIO<1::::", ratio, Math.pow(ratio, 10));
  
        return Math.pow(ratio, 10);
      } else {
        const distance = 0.89976 * Math.pow(ratio, 7.7095) + 0.111;
        return distance;
      }
    };
  
    const onDisconnect = (item: any) => {
      if (currentDevice?.id) {
        BleManager.disconnect(currentDevice.id)
          .then(() => {
            setCurrentDevice(null);
            console.log("disconnected");
          })
          .catch((error) => {
            console.error("Disconnect error:", error);
          });
      } else {
        console.log("No device to disconnect");
      }
    };
  
    let distanceInterval: NodeJS.Timeout;
  
    const startDistanceCheck = (item: any) => {
      distanceInterval = setInterval(() => {
        BleManager.readRSSI(item.id)
          .then((rssi) => {
            const distance = calculateDistance(rssi);
            setDistance(distance);
            setStatus(distance < 3 ? "Unlock" : "Lock");
          })
          .catch((error) => {
            console.error("Error reading RSSI:", error);
          });
      }, 3000); // Adjust the interval time as needed
    };
    const renderItem = ({ item, index }: any) => {
      return (
        <View>
          <View style={styles.bleCard}>
            <Text>{item.name}</Text>
            <TouchableOpacity
              onPress={() =>
                currentDevice?.id === item?.id
                  ? onDisconnect(item)
                  : onConnect(item)
              }
            >
              <Text>
                {currentDevice?.id === item?.id ? "Disconnect" : "Connect"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
  
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.fullRow}>
          {/* <View style={styles.tempCard}>
                      <Text style={styles.label}>{status == "Lock" ? "Locked" : "Unlocked"}</Text>
                      <Image style={styles.icon} source={status == "Lock" ? require('../../assets/images/locked.png') : require('../../assets/images/unlocked.png')} />
                      <Text style={styles.label}>{`${distance ? distance.toFixed(2) + "m" : "N/A"}`}</Text>
                  </View> */}
          <View style={styles.tempCard}>
            <Text style={styles.label}>Temperature</Text>
            <Text style={styles.label}>
              {temperature ? temperature : "N/A"} °C
            </Text>
          </View>
        </View>
        {isScanning ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
        ) : (
          <FlatList
            data={bluetoothDevices}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        )}
  
        <TouchableOpacity onPress={() => startScanning()} style={styles.scanBtn}>
          <Text>Start Scan</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default ConnectDevice;
  
  const styles = StyleSheet.create({
    bleCard: {
      width: "90%",
      padding: 10,
      alignSelf: "center",
      marginVertical: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "orange",
      elevation: 5,
      borderRadius: 5,
    },
    button: {
      width: 100,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "pink",
      borderRadius: 5,
    },
    label: {
      fontSize: 20,
      textAlign: "center",
      color: "red",
    },
    icon: {
      width: 60,
      height: 60,
      resizeMode: "contain",
    },
    tempCard: {
      backgroundColor: "yellow",
      elevation: 2,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    fullRow: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      alignSelf: "center",
    },
    scanBtn: {
      width: "90%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "blue",
      borderRadius: 5,
      alignSelf: "center",
    },
  });
  