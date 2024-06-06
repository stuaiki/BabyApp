import { AuthStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Animated,
} from "react-native";

//this is a code for when app starts
const Splash = ({ navigation }: NativeStackScreenProps<AuthStackParamList>) => {
  const scaleAnim = new Animated.Value(0); //start value
  const scaleAnimText = new Animated.Value(0); //start value

  useEffect(() => {
    const loadResources = async () => {
      try {
        // Simulate loading resources with a timeout
        setTimeout(() => {
          navigation.replace("Login"); // Use 'replace' to avoid going back to the splash screen
        }, 3000); // Adjust time as needed based on your actual loading time
      } catch (error) {
        console.error("Failed to load resources", error);
      }
    };
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 2, // Zoom in
        duration: 1300,
        useNativeDriver: true, // Use native driver for better performance
      }),
      Animated.timing(scaleAnimText, {
        toValue: 1.2, // Zoom in
        duration: 1200,
        useNativeDriver: true, // Use native driver for better performance
      }),
    ]).start(() => loadResources());
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.Image
        source={require("./../../assets/carseatRender.png")}
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
      />
      <Animated.Text
        style={[styles.text, { transform: [{ scale: scaleAnimText }] }]}
      >
        Cozy Control
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5f4ff",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    color: "#80c8ff", //  text color
    textShadowColor: "white", // white shadow
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
    fontWeight: "bold",
  },
});

export default Splash;
