import React, { useState, useContext } from "react";
import "./authStyle.scss";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(`${apiKey}/register`, {
        name,
        surname,
        email,
        password,
      });
      navigate("/");
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
            placeholder="Name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            min="3"
          />
          <input
            type="text"
            placeholder="Surname"
            name="surname"
            onChange={(e) => setSurname(e.target.value)}
            min="3"
          />
          <input
            type="text"
            placeholder="Email"
            name="email"
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
            have already an account ? <Link to="/">Create One.</Link>
          </span>
        </form>
      </div>
    </>
  );
};

export default Signup;
