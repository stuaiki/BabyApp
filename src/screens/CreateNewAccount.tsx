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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation";
import RNPickerSelect from "react-native-picker-select";
import { StackNavigationProp } from "@react-navigation/stack";
import CustomInput from "../Components/CustomInput/CustomInput";
import { PickerStyle } from "react-native-picker-select";
import { Alert } from "react-native";

interface CreateButtonProps {
  onPress: () => void;
  title: string;
}

const CreateAccount = ({
  navigation,
}: NativeStackScreenProps<AuthStackParamList>) => {
  const [state, setState] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); // if you add last name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  // create button
  const CreateButton: React.FC<CreateButtonProps> = ({ onPress, title }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.Redbutton}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const handleCreateAccount = async (): Promise<void> => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !state
    ) {
      Alert.alert("Missing Information", "Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password Mismatch", // Title of the alert
        "Passwords do not match", // Message
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }, // Button array
        ]
      );
      return;
    }
    try {
      // Assuming you have a function to create the account
      // const response = await createAccount({ firstName, lastName, email, password });
      // console.log("Account created successfully:", response);

      // Simulate account creation delay
      setTimeout(() => {
        Alert.alert("Success", "New account created successfully", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"), // Navigate back to login page on success
          },
        ]);
      }, 500);
    } catch (error) {
      console.error("Failed to create account:", error);
      Alert.alert(
        "Account Creation Failed",
        "Failed to create account. Please try again."
      );
    }
  };

  //Lists of all states
  const states = [
    { label: "Alabama", value: "AL" },
    { label: "Alaska", value: "AK" },
    { label: "Arizona", value: "AZ" },
    { label: "Arkansas", value: "AR" },
    { label: "California", value: "CA" },
    { label: "Colorado", value: "CO" },
    { label: "Connecticut", value: "CT" },
    { label: "Delaware", value: "DE" },
    { label: "Florida", value: "FL" },
    { label: "Georgia", value: "GA" },
    { label: "Hawaii", value: "HI" },
    { label: "Idaho", value: "ID" },
    { label: "Illinois", value: "IL" },
    { label: "Indiana", value: "IN" },
    { label: "Iowa", value: "IA" },
    { label: "Kansas", value: "KS" },
    { label: "Kentucky", value: "KY" },
    { label: "Louisiana", value: "LA" },
    { label: "Maine", value: "ME" },
    { label: "Maryland", value: "MD" },
    { label: "Massachusetts", value: "MA" },
    { label: "Michigan", value: "MI" },
    { label: "Minnesota", value: "MN" },
    { label: "Mississippi", value: "MS" },
    { label: "Missouri", value: "MO" },
    { label: "Montana", value: "MT" },
    { label: "Nebraska", value: "NE" },
    { label: "Nevada", value: "NV" },
    { label: "New Hampshire", value: "NH" },
    { label: "New Jersey", value: "NJ" },
    { label: "New Mexico", value: "NM" },
    { label: "New York", value: "NY" },
    { label: "North Carolina", value: "NC" },
    { label: "North Dakota", value: "ND" },
    { label: "Ohio", value: "OH" },
    { label: "Oklahoma", value: "OK" },
    { label: "Oregon", value: "OR" },
    { label: "Pennsylvania", value: "PA" },
    { label: "Rhode Island", value: "RI" },
    { label: "South Carolina", value: "SC" },
    { label: "South Dakota", value: "SD" },
    { label: "Tennessee", value: "TN" },
    { label: "Texas", value: "TX" },
    { label: "Utah", value: "UT" },
    { label: "Vermont", value: "VT" },
    { label: "Virginia", value: "VA" },
    { label: "Washington", value: "WA" },
    { label: "West Virginia", value: "WV" },
    { label: "Wisconsin", value: "WI" },
    { label: "Wyoming", value: "WY" },
  ];

  return (
    <View style={[styles.container, styles.background]}>
      <Text style={styles.title}>Create an Account</Text>

      <View style={styles.input}>
        <CustomInput
          placeholder="FirstName"
          value={firstName}
          setValue={setFirstName}
        />
      </View>

      <View style={styles.input}>
        <CustomInput
          placeholder="LastName"
          value={lastName}
          setValue={setLastName}
        />
      </View>

      <View style={styles.input}>
        <CustomInput
          placeholder="UserName"
          value={username}
          setValue={setUsername}
        />
      </View>

      <View style={styles.input}>
        <CustomInput placeholder="Email" value={email} setValue={setEmail} />
      </View>

      <View style={styles.input}>
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
        />
      </View>

      <View style={styles.input}>
        <CustomInput
          placeholder="Confirm Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
        />
      </View>

      <View style={styles.input}>
        <RNPickerSelect
          onValueChange={(value) => setState(value)}
          items={states}
          placeholder={{
            label: "Select a state...",
            value: null,
          }}
          value={state}
          style={pickerSelectStyles}
        />
      </View>

      <View>
        <CreateButton title="Create Account" onPress={handleCreateAccount} />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Back to Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

const pickerSelectStyles: PickerStyle = StyleSheet.create({
  inputIOS: {
    backgroundColor: "white",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    height: 40,
    fontSize: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  inputAndroid: {
    backgroundColor: "white",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    height: 40,
    fontSize: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  linkText: {
    color: "blue",
    marginTop: 20,
  },
  background: {
    backgroundColor: "#e5f4ff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#708090",
    marginBottom: 10,
  },
  subtitle: {
    height: 90,
    fontSize: 20,
    color: "grey",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "80%",
    marginVertical: 8,
  },
  buttonContainer: {
    marginTop: 10,
    width: "90%",
    paddingTop: 20,
  },
  Bluebutton: {
    backgroundColor: "#6082B6", // Example color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2, // only for Android
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  Redbutton: {
    backgroundColor: "#F97971", // Example color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2, // only for Android
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    marginTop: 30,
  },
});

export default CreateAccount;
