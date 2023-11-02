import { useState, useEffect, createContext } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = Cookies.get("token");
  const [auth, setAuth] = useState({
    user: null,
    token: token,
  });
  const [rooms, setRooms] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const navigate = useNavigate();

  const setUser = async (data) => {
    setAuth({ user: data.user, token: data.token });
  };

  const apiKey = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const getUser = async () => {
    fetch(`${apiKey}/user`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok || res.status >= 400) {
          throw new Error("Request failed with status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        setAuth({ ...auth, user: data.user });
        navigate("/home");
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const getRooms = async (userId) => {
    fetch(`${apiKey}/rooms/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok || res.status >= 400) {
          throw new Error("Request failed with status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        setRooms(data.rooms);
        // data.rooms.map((item) => {
        //   console.log(item);
        //   window.socket.emit("joinRoom", item.uuid);
        //   console.log(item.uuid);
        // });
        console.log(data.rooms);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  useEffect(() => {
    if (auth.user) {
      getRooms(auth.user.id);
    }
  }, [auth]);

  useEffect(() => {
    setAuth({ ...auth, token: token });
    if (token) {
      getUser();
    }
  }, []);

  // useEffect(() => {
  //   if (auth.user) {
  //     getRooms(auth.user.id);
  //   }
  // }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        setUser,
        activeUsers,
        setActiveUsers,
        rooms,
        setRooms,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
