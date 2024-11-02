import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Linking,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackParamList } from "../types/navigation";
import { useBluetooth } from "../../BluetoothContext";

const MonitorSeats = ({
  navigation,
}: NativeStackScreenProps<MainStackParamList>) => {
  const { allDevices, isConnected, connectedDevice } = useBluetooth();
  return (
    <View style={[styles.container, styles.whitebackground]}>
      <View style={[styles.container, styles.whitebackground]}>
        <Text style={styles.headerText}>Active Seat</Text>
        <TouchableOpacity
          style={[styles.wideButton, styles.buttonContainer, styles.background]}
          onPress={() => navigation.navigate("TemperatureMonitor")}
        >
          <Image
            source={require("../../assets/carseatRender.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>
            Alexa Rose {"\n"}
            <Text
              style={[
                styles.connectionStatus,
                { color: isConnected ? "green" : "red" },
              ]}
            >
              {isConnected ? (
                <Text style={{ fontWeight: "bold" }}>Connected</Text>
              ) : (
                "Not connected"
              )}
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.wideButton, styles.buttonContainer, styles.background]}
        >
          <Image
            source={require("../../assets/carseatRender.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>Sofia Rose</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.wideButton, styles.buttonContainer, styles.background]}
          onPress={() => navigation.navigate("SyncDevice")}
        >
          <Text style={styles.addSeat}>+ Add a Seat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  background: {
    backgroundColor: "#e5f4ff",
  },
  whitebackground: {
    backgroundColor: "white",
  },
  buttonContainer: {
    padding: 10,
    flexDirection: "row",
    flex: 0,
    width: "95%",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    marginBottom: 20,
    marginTop: 20,
    color: "grey",
  },
  gridContainer: {
    flex: 1.3,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    width: "40%", // Adjust size according to your needs
    margin: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  wideButton: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    width: "90%", // Adjust size according to your needs
    margin: 10,
    padding: 20,
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    marginTop: 15,
    textAlign: "center",
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  text: {
    // Allows text to fill up the remaining space in the container
    fontSize: 20, // Set the font size
    marginLeft: 30,
  },
  addSeat: {
    fontSize: 20,
    color: "grey",
    padding: 15,
  },
  connectionStatus: {
    fontSize: 13,
    marginVertical: 10,
  },
});

export default MonitorSeats;
