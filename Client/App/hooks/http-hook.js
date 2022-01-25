import { useState, useCallback, useContext } from "react";
import axios from "axios";
import { API_URL, CLOUDINARY_URL } from "../constanst";
import { AuthContext } from "../context/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const auth = useContext(AuthContext);

  const registerUser = useCallback(async (values) => {
    setIsLoading(true);
    const data = new FormData();
    data.append("file", values.image);
    data.append("upload_preset", "usersimage");
    data.append("cloud_name", "dxb3be1fg");
    fetch(CLOUDINARY_URL, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        sendRequest(values, data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const sendRequest = useCallback(async (values, url) => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      cancelRequest(controller);
    }, 10000);
    let token = "";
    try {
      token = await AsyncStorage.getItem("notification-token");
    } catch (e) {}

    try {
      const response = await axios.post(
        `${API_URL}user/register`,
        {
          username: values.username,
          phone: values.phone,
          password: values.password,
          email: values.email,
          pic: url,
          notificationToken: token,
        },
        {
          signal: controller.signal,
        }
      );

      const res = await response.data;

      if (res.message === "OK") {
        auth.login({
          token: res.token,
          userId: res.userId,
          phone: res.phone,
          pic: res.pic,
        });
      } else {
        throw res.message;
      }
      clearTimeout(timer);
      setIsLoading(false);
      return;
    } catch (err) {
      if (axios.isCancel(err)) {
        console.error(err);
      } else {
        if (typeof err === "string") {
          console.error(err);
          setError(err);
        } else {
          console.log(typeof err);
          setError("An unexpected error occured,please try again later");
        }
        setIsLoading(false);
        clearTimeout(timer);
      }
    }
  });

  const loginUser = useCallback(async (values) => {
    const controller = new AbortController();
    setIsLoading(true);

    const timer = setTimeout(() => {
      cancelRequest(controller);
    }, 10000);

    try {
      const response = await axios.post(
        `${API_URL}user/login`,
        {
          phone: values.phone,
          password: values.password,
        },
        {
          signal: controller.signal,
        }
      );

      const res = await response.data;

      if (res.message === "OK") {
        auth.login({
          token: res.token,
          userId: res.userId,
          phone: res.phone,
          pic: res.pic,
        });
      } else {
        throw res.message;
      }
      setIsLoading(false);
      clearTimeout(timer);
      return;
    } catch (err) {
      if (axios.isCancel(err)) {
        //console.log("Request canceled", err.message);
      } else {
        if (typeof err === "string") {
          setError(err);
        } else {
          console, log(err);
          setError("An unexpected error occured,please try again later");
        }
        setIsLoading(false);
        clearTimeout(timer);
      }
    }
  }, []);

  const cancelRequest = (controller) => {
    setIsLoading(false);
    controller.abort();
    setError("Servers are busy at the moment, please try again later");
    return;
  };

  return {
    isLoading,
    error,
    registerUser,
    loginUser,
  };
};
