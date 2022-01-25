import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../../constanst";

export default function Call({ navigation }) {
  const [cameraPerm, setCameraperm] = useState(null);
  const [micPerm, setMicPerm] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const askPermissions = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraperm(status === "granted");

      const res = await Camera.requestMicrophonePermissionsAsync();
      setMicPerm(res.status === "granted");
    } catch (e) {}
  };

  useEffect(() => {
    askPermissions();
  }, []);

  if (cameraPerm === null || micPerm === null) {
    return <View />;
  }

  if (cameraPerm === false || micPerm === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.camera2}></View>
      <Camera style={styles.camera1} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "grey" }]}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Ionicons name="camera-reverse-outline" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.button, { backgroundColor: "red" }]}
          >
            <Ionicons name="call-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  camera1: {
    flex: 0.5,
  },
  camera2: {
    flex: 0.5,
    backgroundColor: "red",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 15,
    alignItems: "center",
    justifyContent: "space-around",
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 100,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
