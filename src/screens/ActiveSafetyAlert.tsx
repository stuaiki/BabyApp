import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { CheckBox } from "react-native-elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackParamList } from "../types/navigation";
import BleManager from 'react-native-ble-manager'

const ActiveSafetyAlert = ({
  navigation,
}: NativeStackScreenProps<MainStackParamList>) => {
  const [checked30Minutes, setChecked30Minutes] = useState(false);
  const [checked10Feet, setChecked10Feet] = useState(false);
  const [checkedPush, setCheckedPush] = useState(false);
  const [checkedAlerm, setCheckedAlerm] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.headText}>Active Safety Alerts</Text>
      <CheckBox
        title="Baby has been in the seat for 30+ minutes"
        checked={checked30Minutes}
        onPress={() => setChecked30Minutes(!checked30Minutes)}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.text}
      />
      <CheckBox
        title="Baby is in the car seat when car is off"
        checked={checked10Feet}
        onPress={() => setChecked10Feet(!checked10Feet)}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.text}
      />

      <Text style={styles.spaceText}></Text>
      <Text style={styles.headText}>Active Safety Alerts</Text>
      <CheckBox
        title="Push Notification"
        checked={checkedPush}
        onPress={() => setCheckedPush(!checkedPush)}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.text}
      />
      <CheckBox
        title="Alarm"
        checked={checkedAlerm}
        onPress={() => setCheckedAlerm(!checkedAlerm)}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.text}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FBFD",
    alignItems: "center",
    justifyContent: "center", // Center content vertically
  },
  spaceText: {
    marginBottom: 0,
    marginTop: 30,
  },
  headText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  checkBoxContainer: {
    width: "100%",
    backgroundColor: "transparent",
    borderColor: "transparent",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ADD8E6",
    borderRadius: 5,
    width: "30%",
  },
  backButtonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    paddingTop: 0,
  },
});

export default ActiveSafetyAlert;
