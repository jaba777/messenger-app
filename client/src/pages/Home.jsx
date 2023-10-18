import useSocketSetup from "../components/useSocketSetup";
import "./Home.scss";
import * as React from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { useTrail, animated } from "@react-spring/web";
import AccountCircle from "@mui/icons-material/AccountCircle";
import axios from "axios";
import { AiOutlineUser } from "react-icons/ai";
import { AuthContext } from "../context/authContext";

const Home = () => {
  useSocketSetup();
  const [keyword, setkeyword] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { activeUsers, auth } = React.useContext(AuthContext);
  const searchUsers = (e) => {
    setkeyword(e.target.value);
  };

  // const animatedUsers = useTrail(
  //   users.length,
  //   () => ({
  //     from: { opacity: 0 },
  //     to: { opacity: 1 },
  //     delay: (index) => (index % 10) * 300,
  //   }),
  //   []
  // );

  const searchUsersHandler = async () => {
    setLoading(true);
    try {
      const users = await axios.get(
        `http://localhost:4000/auth/search/${keyword}`
      );

      console.log("Users:", users.data);
      setUsers(users.data);
      setLoading(false);
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      if (keyword !== "") {
        searchUsersHandler();
      } else if (keyword === "") {
        setUsers([]);
      }
    }, 1000);
    return () => clearTimeout(delayInputTimeoutId);
  }, [keyword]);

  const createRoom = async (receiverId) => {
    try {
      createRoom;
      const users = await axios.post(`http://localhost:4000/auth/room`, {
        sender: auth.user.id,
        receiver: receiverId,
      });
      console.log(users.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="container">
        <div className="chat-container">
          <div className="left">
            <Box sx={{ "& > :not(style)": { m: 1 } }}>
              <FormControl
                variant="standard"
                style={{ color: "rgb(237 222 222 / 54%)" }}
              >
                <InputLabel
                  htmlFor="input-with-icon-adornment"
                  style={{ color: "#fff" }}
                >
                  With a start adornment
                </InputLabel>
                <Input
                  id="input-with-icon-adornment"
                  className="search_input"
                  onChange={searchUsers}
                  value={keyword}
                  style={{
                    color: "#fff",
                    borderBottom: "1px solid #fff",
                  }}
                  startAdornment={
                    <InputAdornment position="start" style={{ color: "#fff" }}>
                      <AccountCircle style={{ color: "rgb(214, 214, 214)" }} />
                    </InputAdornment>
                  }
                />
                <div
                  style={{
                    color: "#45474B",
                    background: "#F5F7F8",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.3rem",
                  }}
                >
                  {!loading &&
                    users.map((props, index) => {
                      const isActive = activeUsers.some(
                        (onlineUser) => onlineUser.userData.id === props.id
                      );
                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            gap: "0.3rem",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => createRoom(props.id)}
                        >
                          <span style={{ fontSize: "1.3rem" }}>
                            <AiOutlineUser />
                          </span>
                          <p style={{ fontWeight: "800" }}>{props.username}</p>
                          <div
                            className={isActive ? "active" : "non_active"}
                          ></div>
                        </div>
                      );
                    })}
                </div>
              </FormControl>
            </Box>
          </div>
          <div className="right"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
