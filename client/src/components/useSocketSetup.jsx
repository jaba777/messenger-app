import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import io from "socket.io-client";

const useSocketSetup = () => {
  const { auth, setActiveUsers } = useContext(AuthContext);
  useEffect(() => {
    let socket = io("http://localhost:4000", {
      "sync disconnect on unload": true,
      transports: ["websocket"],
    });
    socket.on("connect", () => {
      if (auth.user !== null) {
        socket.emit("auth", auth);
        //socket.emit("room", auth.user.id);
      }
    });

    socket.on("auth", (authData) => {
      console.log("Received auth data:", authData);
      setActiveUsers(authData);
      console.log(authData);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
      // socket.emit("disconnect", auth);
      socket.removeAllListeners();
    });

    return () => {
      // Clean up when the component unmounts
      socket.off("disconnect");
    };
  }, [auth, setActiveUsers]);
};

export default useSocketSetup;
