import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { color } from "../constanst";
import { Ionicons } from "@expo/vector-icons";
import { getSender, getSenderPic } from "../config/ChatLogics";
import { AuthContext } from "../context/auth-context";

const ChatRow = ({ chat, onChatSelect }) => {
  const auth = useContext(AuthContext);
  const latest = chat.latestMessage ? chat.latestMessage : null;

  return (
    <TouchableOpacity
      onLongPress={() => {
        Alert.alert("Delete", "Are you sure you want to delete this message?");
      }}
      onPress={() => {
        onChatSelect();
      }}
      style={styles.container}
    >
      <Image
        source={{ uri: getSenderPic(auth.userId, chat.users) }}
        style={styles.photo}
      />
      <View style={styles.container_text}>
        <Text style={styles.username}>
          {!chat.isGroupChat
            ? getSender(auth.userId, chat.users)
            : chat.chatName}
        </Text>
        <Text style={styles.description}>
          {/* {latest && latest.content.length > 50
            ? latest.content.substring(0, 20) + "..."
            : latest.content} */}
          {latest ? latest.content.substring(0, 25) : ""}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          Alert.alert("Delete", "Are you sure you want to delete this message?")
        }
      >
        <Ionicons
          containerStyle={styles.icon}
          name="trash-outline"
          size={28}
          color="red"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "white",
  },
  username: {
    fontSize: 16,
    color: color,
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
    justifyContent: "center",
  },
  description: {
    fontSize: 14,
    fontStyle: "italic",
    color: "grey",
  },
  photo: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
});

export default ChatRow;
