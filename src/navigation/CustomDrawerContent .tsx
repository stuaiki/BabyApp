import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet } from "react-native";

// header and footer for Drawer
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.customHeader}>
        <Text style={styles.customHeaderText}>Cozy Control</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.customFooter}>
        <Text>Custom Footer Content Here</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  customHeader: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#99d4ff", // Custom color for the header
  },
  customFooter: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f4f4", // Different color for the footer
  },
  customHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default CustomDrawerContent;
