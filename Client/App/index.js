import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootStackScreen from "./Navigation";
import { useAuth } from "./hooks/auth-hook";
import { AuthContext } from "./context/auth-context";
import { StyleSheet, StatusBar } from "react-native";
import { color } from "./constanst";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  const { token, login, logout, userId, phone, pic, gps, toggleGpsAccess } =
    useAuth();

  useEffect(async () => {
    let token = null;
    try {
      const { status } = await Notifications.requestPermissionsAsync(
        Permissions.NOTIFICATIONS
      );
      if (status !== "granted") return;

      const res = await Notifications.getExpoPushTokenAsync();
      token = res.data;
    } catch (err) {}

    try {
      if (!token) return;
      await AsyncStorage.setItem("notification-token", token);
    } catch (err) {}

    // Permissions.getAsync(Permissions.NOTIFICATIONS)
    //   .then((statusObj) => {
    //     if (statusObj.status !== "granted") {
    //       return Permissions.askAsync(Permissions.NOTIFICATIONS);
    //     }
    //     return statusObj;
    //   })
    //   .then((statusObj) => {
    //     if (statusObj.status !== "granted") {
    //       throw new Error("Permission not granted!");
    //     }
    //   })
    //   .then(() => {
    //     return Notifications.getExpoPushTokenAsync();
    //   })
    //   .then((response) => {
    //     const token = response.data;
    //     setPushToken(token);
    //     console.log(token);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return null;
    //   });
  }, []);

  useEffect(() => {
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {});

    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        userPhone: phone,
        pic: pic,
        phone: phone,
        login: login,
        logout: logout,
        gps: gps,
        toggleGpsAccess: toggleGpsAccess,
      }}
    >
      <StatusBar backgroundColor={color} barStyle="default" />

      <NavigationContainer>
        <RootStackScreen token={token} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
