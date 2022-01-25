import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { color } from "../../../constanst";
import { AuthContext } from "../../../context/auth-context";
import { API_URL } from "../../../constanst";
import axios from "axios";

const SearchUser = ({ navigation }) => {
  const [search, setSearch] = useState(null);
  const auth = useContext(AuthContext);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const searchUser = async () => {
    if (!search) {
      Alert.alert("Warning", "Enter a phone");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}user?search=${search}`,
        config
      );
      //console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert("Error", "Failed to load the search results");
    }
  };

  const accessChat = async (userId, username, pic) => {
    //console.log(userId);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const { data } = await axios.post(`${API_URL}chat`, { userId }, config);

      navigation.navigate("MessagesNav", {
        screen: "Messages",
        params: { messages: data, username: username, pic: pic },
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not get users chat");
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.items}>
        <TextInput
          style={styles.input}
          placeholder="Your friend's phone..."
          placeholderTextColor={color}
          value={search}
          onChangeText={setSearch}
          ref={inputRef}
        />
        <Button
          style={styles.button}
          title="Find"
          onPress={() => searchUser()}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={color} size="large" />
      ) : (
        searchResult?.map((user) => (
          <TouchableOpacity
            key={user._id}
            onPress={() => {
              accessChat(user._id, user.username, user.pic);
            }}
            style={styles.container2}
          >
            <Image source={{ uri: user.pic }} style={styles.photo} />
            <View style={styles.container_text}>
              <Text style={styles.title}>{user.username}</Text>
              <Text style={styles.description}>{user.email}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
  container2: {
    flexDirection: "row",
    padding: 10,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: "#FFF",
  },
});

export default SearchUser;
