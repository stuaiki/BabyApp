// import React, { useEffect } from "react";
// import { View, Text, Button } from "react-native";
// import RootNavigator from "./src/navigation/RootNavigator";
// import useBLE from "./useBLE";

// const App = () => {
//   const {
//     requestPermissions,
//     scanForPeripherals,
//     stopScanning,
//     allDevices,
//     connectToDevice,
//   } = useBLE();

//   useEffect(() => {
//     const initializeBLE = async () => {
//       const hasPermission = await requestPermissions();
//       if (hasPermission) {
//         scanForPeripherals();
//       } else {
//         console.log("Bluetooth permissions not granted");
//       }
//     };

//     initializeBLE();

//     return () => {
//       console.log("Stopping Bluetooth scan...");
//       stopScanning();
//     };
//   }, []);

//   // UI for displaying and connecting to devices
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <RootNavigator />
//       <Text>Available Devices:</Text>
//       {allDevices.map((device) => (
//         <View key={device.id} style={{ margin: 10 }}>
//           <Text>{device.name || "Unnamed device"}</Text>
//           <Button title="Connect" onPress={() => connectToDevice(device)} />
//         </View>
//       ))}
//     </View>
//   );
// };

// export default App;

import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import RootNavigator from "./src/navigation/RootNavigator";
import useBLE from "./useBLE";

const App = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    stopScanning,
    allDevices,
    connectToDevice,
  } = useBLE();

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
      <RootNavigator />
  );
};

export default App;
