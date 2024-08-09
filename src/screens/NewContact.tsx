import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation";
import { Alert } from "react-native";

interface AddButtonProps {
  onPress: () => void;
  title: string;
}

const NewContact = ({
  navigation,
}: NativeStackScreenProps<AuthStackParamList>) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); // if you add last name
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const AddButton: React.FC<AddButtonProps> = ({ onPress, title }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.Redbutton}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const handleAddButton = async (): Promise<void> => {
    if (!firstName || !lastName || !email || !phoneNumber) {
      Alert.alert("Missing Information", "Please fill out all fields.");
      return;
    }

    try {
      // Simulate account creation delay
      setTimeout(() => {
        Alert.alert("Success", "New account created successfully", [
          {
            text: "OK",
            onPress: () => navigation.navigate("PeopleToAlert"), // Navigate back to PeopleToAlert page on success
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

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>New Contact</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#A9A9A9"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#A9A9A9"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A9A9A9"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#A9A9A9"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* Wrap AddButton and BackButton in a horizontal View */}
      <View style={styles.buttonContainer}>
        <AddButton title="Add" onPress={handleAddButton} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("PeopleToAlert")}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FBFD", // Adjusted background color similar to the image
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#4E4E4E", // Similar text color as in the image
  },
  input: {
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: "#000000", // Dark grey border similar to the image
    fontSize: 18,
    marginBottom: 30,
    color: "#4E4E4E", // Text color similar to the image
    paddingVertical: 10, // Vertical padding to match the style in the image
  },
  backButton: {
    marginTop: 20,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#ADD8E6",
    width: "40%",
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  Redbutton: {
    marginTop: 20,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#F97971",
    width: "40%",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row", // Align buttons horizontally
    justifyContent: "space-between", // Add space between the buttons
    width: "80%", // Adjust the width of the container to align buttons properly
    marginTop: 20,
  },
});

export default NewContact;
