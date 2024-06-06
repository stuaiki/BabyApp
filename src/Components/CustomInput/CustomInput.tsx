import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface CustomInputProps {
  value: string;
  setValue: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  setValue,
  placeholder,
  secureTextEntry,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignSelf: "stretch", // This ensures it stretches to fill the parent width
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 8,
    height: 40,
  },
  input: {
    flex: 1, // Ensures the input fills the height of the container
    textAlign: "left", // Centers text horizontally
    fontSize: 14, // Optionally set the font size
    includeFontPadding: false, // Ensure the padding is not affecting the text alignment
  },
});

export default CustomInput;
