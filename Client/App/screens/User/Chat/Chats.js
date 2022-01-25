import { AuthContext } from "../../../context/auth-context";
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import ChatRow from "../../../components/ChatRow";
import { color } from "../../../constanst";
import HeaderIcons from "../../../components/HeaderIcons";
import {
  getSender,
  getSenderPic,
  getSenderToken,
} from "../../../config/ChatLogics";
import { useMessagesHook } from "../../../hooks/messages-hook";
import { useIsFocused } from "@react-navigation/native";

const Chats = ({ navigation }) => {
  const auth = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const { loading, error, fetchChats, chats } = useMessagesHook();
  const isFocused = useIsFocused();

  useEffect(() => {
    try {
      fetchChats();
    } catch (error) {
      Alert.alert("Error", "Could not load chats");
    }

    if (isFocused) {
      fetchChats();
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(false);
    fetchChats();
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TextInput
          placeholderTextColor={color}
          style={styles.input}
          placeholder="Find a friend..."
          onFocus={() => {
            navigation.push("SearchUser", { name: "User 1 " });
          }}
        />

        {loading && <ActivityIndicator color={color} size="large" />}
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {chats && (
            <>
              {chats ? (
                chats.map((chat) => {
                  if (chat.latestMessage) {
                    return (
                      <ChatRow
                        key={chat._id}
                        onChatSelect={() => {
                          navigation.navigate("MessagesNav", {
                            screen: "Messages",
                            params: {
                              messages: chat,
                              username: getSender(auth.userId, chat.users),
                              pic: getSenderPic(auth.userId, chat.users),
                              token: getSenderToken(auth.userId, chat.users),
                            },
                          });
                        }}
                        chat={chat}
                      />
                    );
                  }
                })
              ) : (
                <Text>No chats found</Text>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

function CustomHeader() {
  const auth = useContext(AuthContext);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        style={{ width: 40, height: 40, borderRadius: 50 }}
        source={{
          uri: auth.pic,
        }}
      />
      <Text style={styles.title}>Your Messages</Text>
    </View>
  );
}

export const screenOptions = ({ route }) => {
  return {
    headerTitle: () => <CustomHeader />,
    headerRight: () => (
      <HeaderIcons
        logout
        team
        onTeamPress={() => {
          Alert.alert("Group Chat", "Find friends for your group chat");
        }}
      />
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: color,
    borderRadius: 15,
    fontWeight: "bold",
  },
  title: {
    padding: 10,
    fontSize: 17,
    color: color,
    fontWeight: "bold",
  },
});

export default Chats;
