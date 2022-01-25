import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  Alert,
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Button,
  Input,
} from "react-native";
import { color, ENDPOINT } from "../../../constanst";
import HeaderIcons from "../../../components/HeaderIcons";
import { API_URL } from "../../../constanst";
import { AuthContext } from "../../../context/auth-context";
import axios from "axios";
import ChatMessages from "../../../components/ChatMessages";
import { io } from "socket.io-client";

const Messages = ({ route, navigation }) => {
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const auth = useContext(AuthContext);
  const [selectedChat, setSelectedChat] = useState();
  const [token, setToken] = useState();

  const fetchMessages = async () => {
    console.log("fetcings");
    const selectedchat = route.params.messages ? route.params.messages : null;
    if (!selectedchat) return;

    setSelectedChat(selectedchat);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      setLoading(true);
      //console.log(selectedchat._id);
      const { data } = await axios.get(
        `${API_URL}message/${selectedchat._id}`,
        config
      );
      console.log(data);

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedchat._id);
    } catch (error) {
      setLoading(false);
      console.log("messages error   ", error);
      Alert.alert("Error", "Failed to load messages");
    }
  };

  const sendMessage = async () => {
    //console.log(selectedChat);
    if (!newMessage) return;
    socket.emit("stop typing", selectedChat._id);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const { data } = await axios.post(
        `${API_URL}message`,
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      );

      setMessages([...messages, data]);
      setNewMessage("");
      socket.emit("new message", data);

      if (!token) return;
      try {
        fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: token,
            data: { extraData: "Some data" },
            title: `${data.sender.username}`,
            body: `${data.content}`,
          }),
        });
      } catch (error) {}
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not send message");
    }
  };

  useEffect(() => {
    const token = route.params.token;
    if (token) {
      setToken(token);
      //console.log(token);
    }
  }, []);

  useEffect(() => {
    const s = io(ENDPOINT, {
      transports: ["websocket"],
      jsonp: false,
    });
    s.connect();
    s.emit("setup", auth.userId);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("connected", () => {
      fetchMessages();
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  });

  useEffect(() => {
    if (!socket) return;
    socket.on("message recieved", (newMessageRecieved) => {
      if (newMessageRecieved !== null) {
        let temp = messages;
        temp.push(newMessageRecieved);
        setMessages(temp);
      }
    });
  }, [socket]);

  const typingHandler = (value) => {
    setNewMessage(value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator color={color} size="large" />}
      <View style={styles.messagesContainer}>
        {messages && messages.length > 0 && (
          <>
            <ChatMessages messages={messages} onChatRefresh={fetchMessages} />
            {istyping && !typing && <Text>Typing...</Text>}
          </>
        )}
      </View>
      <View style={styles.items}>
        <TextInput
          placeholderTextColor={color}
          style={styles.input}
          placeholder="Hey..."
          value={newMessage}
          onChangeText={typingHandler}
        />

        <Button style={styles.button} title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

function CustomHeader({ username, pic }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        style={{ width: 40, height: 40, borderRadius: 50 }}
        source={{
          uri: pic,
        }}
      />
      <Text style={styles.title}>{username}</Text>
    </View>
  );
}

export const screenOptions = ({ route, navigation }) => {
  return {
    headerTitle: () => (
      <CustomHeader pic={route.params.pic} username={route.params.username} />
    ),
    headerRight: () => (
      <HeaderIcons
        camera
        add
        onCameraPress={() => navigation.push("Call")}
        onAddPress={() => {
          Alert.alert("Add member", "fff");
        }}
      />
    ),
    headerTintColor: color,
  };
};

const styles = StyleSheet.create({
  items: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
  },
  input: {
    flex: 1,
    width: "70%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: color,
    borderRadius: 15,
    color: color,
  },
  button: {
    padding: 10,
  },
  title: {
    padding: 10,
    fontSize: 20,
    color: color,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  messagesContainer: { flex: 1 },
});

export default Messages;
