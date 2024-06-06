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
import CustomInput from "../Components/CustomInput/CustomInput";

interface ButtonProps {
  onPress: () => void;
  title: string;
}

// login button
const LoginButton: React.FC<ButtonProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.Bluebutton}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

//New account
const NewAccount: React.FC<ButtonProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.Redbutton}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const Login = ({ navigation }: NativeStackScreenProps<AuthStackParamList>) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Assuming the login is successful
    navigation.replace("Main"); // Assuming 'Main' corresponds to MainStack in your RootNavigator
  };
  const handleAccount = () => navigation.navigate("CreateNewAccount"); //navigate to create account view

  return (
    <View style={[styles.container, styles.background]}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Cozy Control</Text>

      <View style={styles.root}>
        <CustomInput
          placeholder="Username"
          value={username}
          setValue={setUsername}
          secureTextEntry={false}
        />
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry={true}
        />
      </View>

      <View>
        <View style={styles.buttonContainer}>
          <LoginButton title="Sign In" onPress={handleLogin} />
        </View>
      </View>

      <View>
        <View style={styles.buttonContainer}>
          <NewAccount onPress={handleAccount} title="Create an Account" />
        </View>
      </View>

      <TouchableOpacity onPress={() => Linking.openURL("")}>
        <Text style={styles.linkText}>Forgot password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  background: {
    backgroundColor: "#e5f4ff",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#708090",
    marginBottom: 5,
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
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 10,
    width: "90%",
  },
  linkText: {
    color: "blue",
    marginTop: 20,
  },
  redText: {
    color: "red",
    marginTop: 20,
  },
  root: {
    alignItems: "center", // Center children horizontally
    justifyContent: "center", // Center children vertically
    width: "80%", // Ensure this container takes the full available width
  },
});

export default Login;
