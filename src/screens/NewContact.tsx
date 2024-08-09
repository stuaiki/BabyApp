import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const NewContact = ({
  navigation,
}: NativeStackScreenProps<MainStackParamList>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>New Contact</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#A9A9A9"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#A9A9A9"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A9A9A9"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#A9A9A9"
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("PeopleToAlert")}
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
    padding: 10,
    backgroundColor: "#ADD8E6",
    width: "20%",
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
});

export default NewContact;
