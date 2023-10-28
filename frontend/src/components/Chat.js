import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.current = io("http://localhost:4000", {
      reconnectionAttempts: 10, //avoid having user reconnect manually in order to prevent dead clients after a server restart
      timeout: 10000, //before connect_error and connect_timeout are emitted.
      transports: ["websocket"],
    });
  }, []);
  useEffect(() => {
    socket.current.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (message) {
      socket.current.emit("message", { text: message }); // Send message to the "general" room
      setMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto  bg-white shadow-md p-4 mt-8  rounded-lg">
      <h5 className="text-center text-lg font-semibold mb-4">General Chat</h5>
      <div
        className="overflow-auto list-unstyled  mb-4 justify-content-center "
        style={{ height: "350px" }}>
        <ul className="mx-auto p-4">
          {messages.map((msg, index) => (
            <li key={index} className="mb-2 list-unstyled mx-auto">
              <div
                className={`py-2 px-4 rounded-lg bg-${msg.color}-200`}
                style={{ backgroundColor: msg.color }}>
                <div className="text-sm font-semibold text-gray-600 mb-1">
                  {msg.userName} - {msg.timestamp}
                </div>
                {msg.text}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="d-flex align-items-center ">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-grow border rounded-md py-2 px-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className=" text-white py-2 px-4 rounded-md bg-dark">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
