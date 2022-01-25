import { useState, useCallback, useContext } from "react";
import axios from "axios";
import { API_URL } from "../constanst";
import { AuthContext } from "../context/auth-context";

export const useMessagesHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const auth = useContext(AuthContext);
  const [chats, setChats] = useState(null);

  const fetchChats = useCallback(async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      cancelRequest(controller);
    }, 10000);

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}chat`, config, {
        signal: controller.signal,
      });
      setLoading(false);
      setChats(data);
      cancelRequest(controller);
      clearTimeout(timer);
    } catch (error) {
      if (axios.isCancel(err)) {
        //console.log("Request canceled", err.message);
      } else {
        if (typeof err === "string") {
          setError(err);
        } else {
          console.log(err);
          setError("An unexpected error occured,please try again later");
        }
        setLoading(false);
      }
    }
    clearTimeout(timer);
  });

  const cancelRequest = (controller) => {
    setLoading(false);
    controller.abort();
    setError("Servers are busy at the moment, please try again later");
    return;
  };

  return { error, loading, fetchChats, chats };
};
