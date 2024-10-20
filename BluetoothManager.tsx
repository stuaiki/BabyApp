// // services/BluetoothManager.ts

// import { BleManager, Device } from "react-native-ble-plx";
// import { PermissionsAndroid, Platform } from "react-native";

// const manager = new BleManager();

// // Define a function to request permissions with appropriate types
// export async function requestPermissions(): Promise<void> {
//   if (Platform.OS === "android") {
//     // Request Android permissions
//     const grantedScan = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//       {
//         title: "Bluetooth Scan Permission",
//         message:
//           "This app needs Bluetooth Scan permission to discover devices.",
//         buttonPositive: "OK",
//         buttonNegative: "Cancel",
//       }
//     );

//     const grantedConnect = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//       {
//         title: "Bluetooth Connect Permission",
//         message:
//           "This app needs Bluetooth Connect permission to connect to devices.",
//         buttonPositive: "OK",
//         buttonNegative: "Cancel",
//       }
//     );

//     const grantedLocation = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       {
//         title: "Location Permission",
//         message: "This app needs location permission to detect nearby devices.",
//         buttonPositive: "OK",
//         buttonNegative: "Cancel",
//       }
//     );

//     if (
//       grantedScan === PermissionsAndroid.RESULTS.GRANTED &&
//       grantedConnect === PermissionsAndroid.RESULTS.GRANTED &&
//       grantedLocation === PermissionsAndroid.RESULTS.GRANTED
//     ) {
//       console.log("Bluetooth and Location permissions granted for Android");
//     } else {
//       console.log("Bluetooth permissions denied for Android");
//     }
//   } else if (Platform.OS === "ios") {
//     // iOS permissions are handled automatically through Info.plist
//     console.log("iOS does not require runtime permission handling");
//   }
// }

// // Define a function to start scanning for devices
// export function startScanning(): void {
//   manager.startDeviceScan(null, null, (error, device: Device | null) => {
//     if (error) {
//       console.error("Error during scan:", error);
//       return;
//     }

//     if (device) {
//       console.log("Discovered device:", device.name);
//     }
//   });
// }
