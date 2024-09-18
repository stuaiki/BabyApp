import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import BleManager from 'react-native-ble-manager'

const SyncDevice = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Sync Your Device</Text>

      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.activeDot]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>

      <Image
        source={require("../../assets/carseatRender.png")} // Replace with the correct image URL or local image
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.buttonText}>Search Nearby</Text>
      </TouchableOpacity>
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
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2F3E75", // Dark blue color
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
    backgroundColor: "#D3D3D3", // Light grey color for inactive dots
    marginHorizontal: 8,
  },
  activeDot: {
    backgroundColor: "#FF6F61", // Red color for the active dot
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  searchButton: {
    backgroundColor: "#ADD8E6", // Light blue color for the button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SyncDevice;
