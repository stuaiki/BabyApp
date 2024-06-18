import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { CheckBox } from "react-native-elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackParamList } from "../types/navigation";

const NotifyMeThrough = ({
  navigation,
}: NativeStackScreenProps<MainStackParamList>) => {
  const [checkPushNotification, setPushNotification] = useState(false);
  const [checkAlarm, setAlarm] = useState(false);
  const [checkAutomatedCall, setCheckAutomatedCall] = useState(false);
  const [checkedCustom, setCheckedCustom] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.headText}>Notify Me Through...</Text>
      <CheckBox
        title="Push Notifications"
        checked={checkPushNotification}
        onPress={() => setPushNotification(!checkPushNotification)}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.text}
      />
      <CheckBox
        title="Alerm"
        checked={checkAlarm}
        onPress={() => setAlarm(!checkAlarm)}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.text}
      />
      <CheckBox
        title="Automated Call"
        checked={checkAutomatedCall}
        onPress={() => setCheckAutomatedCall(!checkAutomatedCall)}
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
    marginLeft: 90,
  },
  text: {
    fontSize: 18,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ADD8E6",
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default NotifyMeThrough;
