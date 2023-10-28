import express from "express";
import { createServer } from "http";
import { Server as socketIo } from "socket.io";
import randomColor from "randomcolor";

const app = express();
const server = createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Generate a random name and color for the user
  const userName = "User" + Math.floor(Math.random() * 1000);
  const userColor = randomColor();

  socket.join("general"); // Join the "general" room by default
  socket.userName = userName; // Store the user's name
  socket.userColor = userColor; // Store the user's color

  socket.on("message", (message) => {
    const messageWithInfo = {
      text: message.text,
      color: userColor,
      userName,
      timestamp: new Date().toLocaleTimeString(),
    };
    io.to("general").emit("message", messageWithInfo); // Send message with user info and timestamp
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server is running on http://localhost:3000");
});
