import React, { useEffect } from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import useBLE from "./useBLE";

const App = () => {
  const { requestPermissions, scanForPeripherals, stopScanning } = useBLE();

  useEffect(() => {
    const initializeBLE = async () => {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        scanForPeripherals();
      } else {
        console.log("Bluetooth permissions not granted");
      }
    };

    initializeBLE();

    return () => {
      console.log("Stopping Bluetooth scan...");
      stopScanning();
    };
  }, []);

  return <RootNavigator />;
};

export default App;
