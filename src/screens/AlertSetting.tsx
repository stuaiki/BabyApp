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
import { useNavigation } from "@react-navigation/native";
import Account from "./Account";
import BleManager from 'react-native-ble-manager'

const AlertSetting = ({
  navigation,
}: NativeStackScreenProps<MainStackParamList>) => {
  return (
    <View
      style={[styles.container, styles.whitebackground, styles.contentPosition]}
    >
      <Text style={styles.headText}>Alert Settings</Text>
      <TouchableOpacity
        style={[styles.wideButton, styles.buttonContainer, styles.background]}
        onPress={() => navigation.navigate("AlertMeWhen")}
      >
        <Text style={styles.text}>Alert me when...</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.wideButton, styles.buttonContainer, styles.background]}
        onPress={() => navigation.navigate("NotifyMeThrough")}
      >
        <Text style={styles.text}>Notify me through...</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.wideButton, styles.buttonContainer, styles.background]}
        onPress={() => navigation.navigate("PeopleToAlert")}
      >
        <Text style={styles.text}>People to Alert</Text>
      </TouchableOpacity>
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
    flexDirection: "row",
    flex: 0,
    width: "95%",
    margin: "8%",
    height: "18%",
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
  text: {
    // Allows text to fill up the remaining space in the container
    fontSize: 25, // Set the font size
  },
  headText: {
    fontSize: 32,
    color: "grey",
    fontWeight: "bold",
  },
  contentPosition: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AlertSetting;
