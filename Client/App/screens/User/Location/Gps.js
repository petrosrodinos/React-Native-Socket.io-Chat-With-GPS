import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Switch,
  Alert,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { color } from "../../../constanst";
import { AuthContext } from "../../../context/auth-context";
import { io } from "socket.io-client";
import { ENDPOINT } from "../../../constanst";

const Gps = () => {
  const auth = useContext(AuthContext);
  const [gpsLoop, setGpsLoop] = useState(null);
  const [pins, setPins] = useState([]);
  const [socket, setSocket] = useState(null);
  const [defaultLocation, setDefaultLocation] = useState({
    latitude: 35.3211584,
    longitude: 25.1018255,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.0421,
  });

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    socket.emit("location", {
      phone: auth.phone,
      coords: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };

  const setupSocket = () => {
    if (socket) return;
    const s = io(ENDPOINT, {
      transports: ["websocket"],
      jsonp: false,
    });
    s.connect();
    s.emit("gps-enabled", auth.userId);
    setSocket(s);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("connected", () => {
      setGpsLoop(setInterval(getLocation, 10000));
      console.log("connected");
    });
    socket.on("new-coords", (location) => {
      let temp = pins;
      const exists = temp.findIndex((p) => p.phone === location.phone);
      if (exists === -1) {
        temp.push(location);
        setPins(temp);
      } else {
        temp[exists] = location;
        setPins(temp);
      }
      console.log(pins);
    });
  });

  useEffect(() => {
    let gpsl = gpsLoop;
    if (auth.gps && !gpsl) {
      gpsl = true;
      setupSocket();
    }
    if (gpsl && !auth.gps) {
      clearInterval(gpsl);
      setGpsLoop(null);
      gpsl = null;
      socket.disconnect();
      setSocket(null);
    }

    return () => {
      if (socket) {
        console.log("disconected");
        socket.disconnect();
      }
    };
  }, [auth.gps]);

  return (
    <View style={styles.container}>
      <MapView initialRegion={defaultLocation} style={styles.map}>
        {pins &&
          pins.map((p, index) => (
            <Marker key={index} coordinate={p.coords} pinColor={"tomato"}>
              <Callout>
                <>
                  <Text>{p.phone}</Text>
                  <Text>
                    {pins.length} : {index}
                  </Text>
                </>
              </Callout>
            </Marker>
          ))}
      </MapView>
    </View>
  );
};

export const screenOptions = () => {
  const auth = useContext(AuthContext);
  const [isEnabled, setIsEnabled] = useState(auth.gps);
  const toggleSwitch = (e) => {
    Alert.alert(
      "Enable Tracking",
      `Are you sure you want to ${e ? "enable" : "disable"} gps tracking`,
      [
        {
          text: "Yes",
          onPress: () => {
            auth.toggleGpsAccess(e);
            setIsEnabled(e);
          },
        },
        { text: "No" },
      ]
    );
  };

  return {
    headerRight: () => (
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor="#f5dd4b"
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    ),
    headerTitleStyle: {
      color: color,
    },
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default Gps;
