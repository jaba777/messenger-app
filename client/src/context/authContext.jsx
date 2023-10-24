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
  const [activeUsers, setActiveUsers] = useState([]);
  const navigate = useNavigate();

  const setUser = (data) => {
    setAuth({ user: data.user, token: data.token });
  };

  const getUser = () => {
    fetch("http://localhost:4000/auth/user", {
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

  useEffect(() => {
    setAuth({ ...auth, token: token });
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, setUser, activeUsers, setActiveUsers }}
    >
      {children}
    </AuthContext.Provider>
  );
};
