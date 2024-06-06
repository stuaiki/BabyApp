import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { toGammaSpace } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

const Account = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Account</Text>
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/Profile.jpg")} // Placeholder image source
          style={styles.profileImage}
        />
        <Text style={styles.nameText}>Sophia Rose</Text>
        <Text style={styles.emailText}>Sophia@gmail.com</Text>
        <Text style={styles.locationText}>Texas, USA</Text>
        <Text style={styles.detailsText}>Number of Seats: 2</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%", // Ensure it spans the full width
    justifyContent: "center", // Align children at the start of the screen vertically
    alignItems: "center", // Stretch children to match the width
    padding: 20,
    backgroundColor: "#e5f4ff", // White background
  },
  editButton: {
    position: "absolute", // Position it absolutely within its parent container
    top: 10, // 10 pixels from the top
    right: 10, // 10 pixels from the right
    padding: 8,
    backgroundColor: "#e1e1e1",
    marginTop: 0,
    width: 50,
  },

  editButtonText: {
    fontSize: 16,
    textAlign: "center",
    color: "#000", // Black text for better readability
  },
  header: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
    width: "100%", // Use full width of the screen
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 100, // Make it circular
    marginBottom: 30,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8, // Add a small bottom margin for better spacing
  },
  emailText: {
    fontSize: 20,
    marginBottom: 8, // Consistent spacing
  },
  locationText: {
    fontSize: 20,
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 20,
  },
});

export default Account;
