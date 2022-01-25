import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../constanst";
import { prompts } from "../prompts/prompts";

const HeaderIcons = (props) => {
  const { confirmLogout } = prompts();

  return (
    <View style={styles.iconContainer}>
      {props.team && (
        <TouchableOpacity onPress={() => props.onTeamPress()}>
          <Ionicons
            containerStyle={styles.icon}
            name="people-outline"
            size={24}
            color={color}
          />
        </TouchableOpacity>
      )}
      {props.add && (
        <TouchableOpacity onPress={() => props.onAddPress()}>
          <Ionicons
            containerStyle={styles.icon}
            name="add-outline"
            size={30}
            color={color}
          />
        </TouchableOpacity>
      )}
      {props.logout && (
        <TouchableOpacity
          onPress={() => {
            confirmLogout();
          }}
        >
          <Ionicons
            containerStyle={styles.icon}
            name="power-outline"
            size={24}
            color={color}
          />
        </TouchableOpacity>
      )}
      {props.camera && (
        <TouchableOpacity onPress={() => props.onCameraPress()}>
          <Ionicons
            containerStyle={styles.icon}
            name="call-outline"
            size={24}
            color={color}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0AADD1",
  },
  icon: {
    padding: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 100,
  },
});

export default HeaderIcons;
