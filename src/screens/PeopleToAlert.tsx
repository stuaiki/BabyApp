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

const PeopleToAlert = ({
  navigation,
}: NativeStackScreenProps<MainStackParamList>) => {
  return (
    <View style={[styles.container, styles.whitebackground]}>
      <View style={[styles.container, styles.whitebackground]}>
        <Text style={styles.headerText}>People to Alert</Text>
        <TouchableOpacity
          style={[styles.wideButton, styles.buttonContainer, styles.background]}
        >
          <Text style={styles.text}>Alexa Rose</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.wideButton, styles.buttonContainer, styles.background]}
        >
          <Text style={styles.text}>Sofia Rose</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.wideButton, styles.buttonContainer, styles.background]}
          onPress={() => navigation.navigate("NewContact")}
        >
          <Text style={styles.addPeople}>+ Add People</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
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
    width: "85%",
    marginBottom: 20,
    marginLeft: 25,
  },
  headerText: {
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    marginBottom: 20,
    marginTop: 20,
    color: "black",
  },
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
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
  text: {
    // Allows text to fill up the remaining space in the container
    fontSize: 20, // Set the font size
  },
  addPeople: {
    padding: 3,
    fontSize: 15,
    color: "grey",
  },
});

export default PeopleToAlert;
