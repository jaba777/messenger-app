import React, { useState, useContext } from "react";
import "./authStyle.scss";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(`${apiKey}/login`, {
        email,
        password,
      });
      await setUser(res.data);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="sign">
        <form action="" onSubmit={handleSubmit}>
          <div className="brand">
            <h1>snappy</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => setEmail(e.target.value)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </div>
    </>
  );
};

export default Login;
