import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import PrivateRoutes from "./components/PrivateRoutes";
import Signup from "./pages/Signup";

function App() {
  axios.defaults.withCredentials = true;
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
