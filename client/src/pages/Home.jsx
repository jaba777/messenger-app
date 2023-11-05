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
import Header from "../components/Header";

//BiUserCircle

const Home = () => {
  // useSocketSetup();
  const [keyword, setkeyword] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [getRoom, setGetRoom] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [messageContainer, setMessageContainer] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentMessage, setCurrentMessage] = React.useState(null);
  const chatMessagesRef = React.useRef(null);
  const apiKey = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const { activeUsers, auth, rooms, setRooms } = React.useContext(AuthContext);
  const searchUsers = (e) => {
    setkeyword(e.target.value);
  };

  const searchUsersHandler = async () => {
    setLoading(true);
    try {
      const users = await axios.get(`${apiKey}/search/${keyword}`);

      setUsers(users.data);
      setLoading(false);
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
    }
  };

  const getRoomHandler = async (roomId) => {
    try {
      const messages = await axios.post(`${apiKey}/messages`, {
        roomId,
        userId: auth.user.id,
      });

      window.socket.emit("joinRoom", messages.data.data.room.uuid);
      setCurrentMessage(messages.data.data);
      setMessageContainer(messages.data.data.messages);
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
      const users = await axios.post(`${apiKey}/room`, {
        sender: auth.user.id,
        receiver: receiverId,
      });

      if (users.data.room.findFirst.is === true) {
        setGetRoom([...getRoom, users.data.room]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${apiKey}/message/${currentMessage.room.uuid}/${auth.user.id}`,
        {
          message: message,
        }
      );
      setMessage("");
    } catch (error) {}
  };

  React.useEffect(() => {
    if (auth.user === null) return;
    if (window.socket) {
      window.socket.on("sendMessage", (message) => {
        setMessageContainer([...messageContainer, message]);
        console.log("message", message);
      });
    }
  }, [messageContainer, auth, getRoom]);

  const scrollChatToBottom = () => {
    if (chatMessagesRef.current) {
      const chatContainer = chatMessagesRef.current;
      const lastMessage = chatContainer.lastElementChild;

      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  React.useEffect(() => {
    scrollChatToBottom();
  }, [messageContainer]);

  return (
    <>
      <div className="container">
        <Header />
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
                  <div
                    className="room_box"
                    key={index}
                    onClick={() => getRoomHandler(item.roomId)}
                  >
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
              <div className="chat-messages" ref={chatMessagesRef}>
                {messageContainer.map((message) => {
                  return (
                    <div key={message.id}>
                      <div
                        className={`message ${
                          message.room_user_id === auth.user.id
                            ? "sended"
                            : "recieved"
                        }`}
                      >
                        <div className="content ">
                          <p>{message.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <ChatInput
                setMessage={setMessage}
                sendMessage={sendMessage}
                message={message}
              />
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
