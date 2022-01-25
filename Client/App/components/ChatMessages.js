import React, { useContext, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  RefreshControl,
} from "react-native";
import {
  isSameSenderMargin,
  isSameUser,
  isLastMessage,
  isSameSender,
} from "../config/ChatLogics.js";
import { AuthContext } from "../context/auth-context";
import { color } from "../constanst";

const ChatMessages = ({ messages, onChatRefresh }) => {
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef();

  const onRefresh = () => {
    onChatRefresh();
    setRefreshing(false);
  };

  return (
    <ScrollView
      ref={scrollRef}
      onContentSizeChange={() =>
        scrollRef.current.scrollToEnd({ animated: true })
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {messages.map((m, i) => (
        <View
          key={Math.random()}
          style={{
            flexDirection:
              isSameSender(messages, m, i, userId) ||
              isLastMessage(messages, i, userId)
                ? "row"
                : "column",
          }}
        >
          {(isSameSender(messages, m, i, userId) ||
            isLastMessage(messages, i, userId)) && (
            <Image
              source={{ uri: m.sender.pic }}
              style={[
                styles.photo,
                { marginTop: isSameUser(messages, m, i, userId) ? 4 : 15 },
              ]}
            />
          )}
          <View
            style={{
              backgroundColor: `${m.sender._id === userId ? color : "#B9F5D0"}`,
              marginLeft: isSameSenderMargin(messages, m, i, userId),
              marginTop: isSameUser(messages, m, i, userId) ? 4 : 15,
              borderRadius: 10,
              padding: 8,
              marginRight: m.sender._id === userId ? 5 : 0,
              marginBottom: 3,
              maxWidth: "75%",
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ fontSize: 17, fontFamily: "Roboto" }}>
              {m.content}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  message: {
    width: "auto",
    fontSize: 15,
    color: color,
    padding: 7,
  },

  photo: {
    height: 30,
    width: 30,
    borderRadius: 50,
    marginRight: 5,
    marginLeft: 5,
  },
});

export default ChatMessages;
