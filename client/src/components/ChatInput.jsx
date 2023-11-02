import React, { useState } from "react";
import "./Chatinput.scss";
import { IoMdSend } from "react-icons/io";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { BsFillEmojiSmileFill } from "react-icons/bs";
//BsFillEmojiSmileFill

const ChatInput = ({ setMessage, sendMessage, message }) => {
  const [showEmojy, setShowEmojy] = useState(false);
  const onEmojiSelect = (emoji) => {
    const emojiName = emoji.native; // Extract the name from the selected emoji
    console.log(emojiName);
    setMessage(message + emojiName); // Log the emoji name
  };
  const customPickerStyles = {
    width: "300px", // Set your desired width
    height: "400px", // Set your desired height
  };
  return (
    <div className="chatinput_container">
      <form className="input-container" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexDirection: 'row-reverse' }}>
          <button type="submit">
            <IoMdSend />
          </button>
          <div
            style={{
              fontSize: "20px",
              color: "#fff",
              marginRight: "1rem",
              marginBottom: "-0.3rem",
              cursor: "pointer",
            }}
            onClick={() => setShowEmojy(!showEmojy)}
          >
            <BsFillEmojiSmileFill />
          </div>
        </div>

        {/* {root} */}
        <span
          className="span_emojy"
          style={{ display: showEmojy ? "block" : "none" }}
        >
          <Picker
            data={data}
            onEmojiSelect={onEmojiSelect}
            style={customPickerStyles}
          />
        </span>
      </form>
    </div>
  );
};

export default ChatInput;
