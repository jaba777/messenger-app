import useSocketSetup from "../components/useSocketSetup";
import "./Home.scss";
import * as React from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import AccountCircle from "@mui/icons-material/AccountCircle";
import axios from "axios";
import { AiOutlineUser } from "react-icons/ai";
import { AuthContext } from "../context/authContext";
import { BiUserCircle } from "react-icons/bi";
import ChatInput from "../components/ChatInput";

//BiUserCircle

const Home = () => {
  useSocketSetup();
  const [keyword, setkeyword] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [getRoom, setGetRoom] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentMessage, setCurrentMessage] = React.useState(null);
  const { activeUsers, auth, rooms, setRooms } = React.useContext(AuthContext);
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

  const getRoomHandler = async (roomId) => {
    try {
      const messages = await axios.post("http://localhost:4000/auth/messages", {
        roomId,
        userId: auth.user.id,
      });
      console.log(messages.data.data);
      setCurrentMessage(messages.data.data);
    } catch (error) {}
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

  // React.useEffect(() => {
  //   window.socket.on("getRooms", (data) => {
  //     console.log(data);
  //   });
  // }, []);

  const createRoom = async (receiverId) => {
    try {
      const users = await axios.post(`http://localhost:4000/auth/room`, {
        sender: auth.user.id,
        receiver: receiverId,
      });
      console.log(users.data.room.findFirst);
      if (users.data.room.findFirst.is === true) {
        setGetRoom([...getRoom, users.data.room]);
      }
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
                          <p style={{ fontWeight: "800" }}>{props.name}</p>
                          <div
                            className={isActive ? "active" : "non_active"}
                          ></div>
                        </div>
                      );
                    })}
                </div>
              </FormControl>
            </Box>

            <div className="room_container">
              {rooms.map((item, index) => (
                <div
                  key={index}
                  className="room_box"
                  onClick={() => getRoomHandler(item.uuid)}
                >
                  <div className="userIcon">
                    <BiUserCircle />
                  </div>
                  <div className="room_text">
                    <p>{item.roomUsers[0].user.name}</p>
                  </div>

                  {/* <div>{item.roomUsers[0].user.name}</div> */}
                </div>
              ))}
              {getRoom.length > 0 &&
                getRoom.map((item, index) => (
                  <div className="room_box" key={index}>
                    <div className="userIcon">
                      <BiUserCircle />
                    </div>
                    <div className="room_text">
                      <p>{item.user.name}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {currentMessage !== null ? (
            <div className="right">
              <div className="chat-header">
                <div className="user-details">
                  <div className="avatar">
                    {/* <img
                    src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                    alt=""
                  /> */}
                  </div>
                  <div className="username">
                    <h3>{currentMessage.user}</h3>
                  </div>
                </div>
                {/* <Logout /> */}
              </div>
              <div className="chat-messages">
                {/* {messages.map((message) => {
                return (
                  <div ref={scrollRef} key={uuidv4()}>
                    <div
                      className={`message ${
                        message.fromSelf ? "sended" : "recieved"
                      }`}
                    >
                      <div className="content ">
                        <p></p>
                      </div>
                    </div>
                  </div>
                );
              })} */}
              
              </div>
              <ChatInput />
            </div>
          ) : (
            <div style={{ color: "#fff" }}>welcome</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
