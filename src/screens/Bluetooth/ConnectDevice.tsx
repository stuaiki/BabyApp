import {
  FlatList,
  NativeEventEmitter,
  PermissionsAndroid,
  StyleSheet,
  NativeModules,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import BleManager from "react-native-ble-manager";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TEMPERATURE_UUID } from "./BleConstants";
import { Characteristic } from "react-native-ble-plx";
import { readBuilderProgram, reduceEachLeadingCommentRange } from "typescript";

const ConnectDevice = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [bleDevices, setbleDevices] = useState([]);
  const BleManagerModule = NativeModules.BleManager;
  const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  const [temperature, setTemperature] = useState<string | null>(null);
  const [humidity, setHumidity] = useState<string | null>(null);
  const [currentDevice, setCurrentDevice] = useState<any>(null);

  useEffect(() => {
    BleManager.start({ showAlert: false }).then(() => {
      console.log("Module initialized");
    });
  }, []);

  useEffect(() => {
    BleManager.enableBluetooth().then(() => {
      console.log("The bluetooth is already enabled or the user confirm");
    });
    requestPermission();

    return () => {};
  }, []);

  useEffect(() => {
    let stopListener = BleManagerEmitter.addListener(
      "BleManagerStopScan",
      () => {
        setIsScanning(false);
        console.log("Scan is stopped");
        handleGetConnectedDevices();
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
  }, []);
  const requestPermission = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    if (granted) {
      startScanning();
    }
  };

  const startScanning = () => {
    if (!isScanning) {
      BleManager.scan([], 10, true)
        .then(() => {
          console.log("Scan started...");
          setIsScanning(true);
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  };

  const handleGetConnectedDevices = () => {
    BleManager.getDiscoveredPeripherals().then((result: any) => {
      if (result.length === 0) {
        console.log("No Device Found");
        startScanning();
      } else {
        // console.log("RESULTS", JSON.stringify(result));
        const allDevices = result.filter((item: any) => item.name !== null);
        setbleDevices(allDevices);
      }

      console.log("Discovered peripherals: " + result);
    });
  };

  const readCharacteristicFromEvent = (data: any) => {
    const { service, characteristic, value } = data;

    if (characteristic == TEMPERATURE_UUID) {
      const temperature = byteToString(value);
      setTemperature(temperature);
      console.log("temperature", temperature);
    }
  };

  const byteToString = (value: any) => {
    const buffer = new Uint8Array(value);
    const temperature = (buffer[0] | (buffer[1] << 8)) / 100;
    return temperature.toFixed(2); // Adjust based on your device's specifications
  };

  const onConnect = async (item: any) => {
    try {
      await BleManager.connect(item.id);
      setCurrentDevice(item);

      const result = await BleManager.retrieveServices(item.id);
      console.log("result", result);
      onServiceDiscovered(result, item);
    } catch (error) {
      console.log("onConnect Error:::", error);
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

      if (characteristicUUID === TEMPERATURE_UUID) {
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

  const renderItem = ({ item, index }: any) => {
    return (
      <View style={styles.bleCard}>
        <Text>{item.name}</Text>
        <TouchableOpacity onPress={() => onConnect(item)}>
          <Text>Connect</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
        <View></View>
      ) : (
        <View>
          <FlatList
            data={bleDevices}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
          <TouchableOpacity onPress={startScanning}>
            <Text>Start Scan</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ConnectDevice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bleCard: {
    width: "90%",
    padding: 10,
    alignContent: "center",
    marginVertical: 10,
    backgroundColor: "orange",
    elevation: 5,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "pink",
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
  label: {
    fontSize: 20,
    textAlign: "center",
    color: "red",
  },
});
