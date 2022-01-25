import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [phone, setPhone] = useState();
  const [pic, setPic] = useState();
  const [gps, setGps] = useState(false);

  const login = useCallback((values) => {
    setToken(values.token);
    setUserId(values.userId);
    setPhone(values.phone);
    setPic(values.pic);
    const tokenExpirationDate =
      values.expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    addToStorage(values, tokenExpirationDate);
  }, []);

  const addToStorage = async (values, expire) => {
    try {
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          userId: values.userId,
          token: values.token,
          expiration: expire.toISOString(),
          phone: values.phone,
          pic: values.pic,
        })
      );
    } catch (error) {
      console.log("malakia 1");
      Alert.alert("Error", "Could not sign you in");
    }
  };

  const logout = useCallback(() => {
    //console.log("sign out")
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setPhone(null);
    setPic(null);
    removeItem();
  }, []);

  const removeItem = async () => {
    try {
      await AsyncStorage.removeItem("userData");
    } catch (err) {
      console.log("malakia 2");
    }
  };

  // useEffect(() => {
  //   if (token && tokenExpirationDate) {
  //     const remainingTime =
  //       tokenExpirationDate.getTime() - new Date().getTime();
  //     logoutTimer = setTimeout(logout, remainingTime);
  //   } else {
  //     clearTimeout(logoutTimer);
  //   }
  // }, [token, logout, tokenExpirationDate]);

  useEffect(async () => {
    const storedData = await getFromStorage();

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login({
        userId: storedData.userId,
        token: storedData.token,
        expirationDate: new Date(storedData.expiration),
        phone: storedData.phone,
        pic: storedData.pic,
      });
    }
  }, [login]);

  useEffect(async () => {
    try {
      data = await AsyncStorage.getItem("gps-access");
    } catch (error) {
      console.log(error);
      return null;
    }

    if (!data) return;
    let gpsData = JSON.parse(data);
    setGps(gpsData.gpsEnabled);
  }, []);

  const getFromStorage = async () => {
    let data = null;

    try {
      data = await AsyncStorage.getItem("userData");
    } catch (error) {
      console.log(error);
      return null;
    }

    if (data) {
      //console.log(data);
      return JSON.parse(data);
    }
    return null;
  };

  const toggleGpsAccess = useCallback(async (value) => {
    try {
      await AsyncStorage.setItem(
        "gps-access",
        JSON.stringify({
          gpsEnabled: value,
        })
      );
      setGps(value);
    } catch (error) {}
  }, []);

  return {
    token,
    login,
    logout,
    userId,
    phone,
    pic,
    gps,
    toggleGpsAccess,
  };
};
