import React from "react";
import "./Chatinput.scss";
import { IoMdSend } from "react-icons/io";

const ChatInput = () => {
  return (
    <div className="chatinput_container">
      <form className="input-container">
        <input type="text" placeholder="type your message here" />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
