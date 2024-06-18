import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { CheckBox } from "react-native-elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackParamList } from "../types/navigation";

const AlertMeWhen = ({
  navigation,
}: NativeStackScreenProps<MainStackParamList>) => {
  const [checked30Minutes, setChecked30Minutes] = useState(false);
  const [checked10Feet, setChecked10Feet] = useState(false);
  const [checkedCarOff, setCheckedCarOff] = useState(false);
  const [checkedCustom, setCheckedCustom] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.headText}>Alert me when...</Text>
      <CheckBox
        title="Baby has been in the seat for 30+ minutes"
        checked={checked30Minutes}
        onPress={() => setChecked30Minutes(!checked30Minutes)}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.text}
      />
      <CheckBox
        title="Baby is in the car seat more than 10 feet from phone"
        checked={checked10Feet}
        onPress={() => setChecked10Feet(!checked10Feet)}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.text}
      />
      <CheckBox
        title="Baby in car seat when car is off"
        checked={checkedCarOff}
        onPress={() => setCheckedCarOff(!checkedCarOff)}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.text}
      />
      <CheckBox
        title="Custom"
        checked={checkedCustom}
        onPress={() => setCheckedCustom(!checkedCustom)}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.text}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("AlertSetting")}
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
    paddingTop: 130,
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
    textAlign: "center"
  },
});

export default AlertMeWhen;
