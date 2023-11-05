import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import io from "socket.io-client";
const UseSocketSetup = ({ children }) => {
  const { auth, setActiveUsers, setRooms } = useContext(AuthContext);
  useEffect(() => {
    let socket = io("http://localhost:4000", {
      "sync disconnect on unload": true,
      transports: ["websocket"],
    });
    window.socket = socket;
    socket.on("connect", () => {
      if (auth.user !== null) {
        socket.emit("auth", auth);
        //socket.emit("room", auth.user.id);
      }
    });

    socket.on("auth", (authData) => {
      
      setActiveUsers(authData);
      
    });

    // socket.on('sendMessage', (message) => {
    //   // Handle the received message and update your UI
    //   console.log('Received message:', message);
    //   // Update your React component state or perform any other necessary actions
    // });

    // socket.on("getrooms", (data) => {
    //   console.log("asad", data);
    //   if (data !== null) {
    //     setRooms(data);
    //   }
    // });

    socket.on("disconnect", () => {
      
      // socket.emit("disconnect", auth);
      socket.removeAllListeners();
    });

    return () => {
      // Clean up when the component unmounts
      socket.off("disconnect");
    };
  }, [auth, setActiveUsers]);

  return <>{children}</>;
};

export default UseSocketSetup;
