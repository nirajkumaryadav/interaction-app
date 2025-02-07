import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

import { addUser, removeUser, getUser } from "./utils/users.js";
import userRoutes from "./routes/user.js";
import roomRoutes from "./routes/room.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL }));

app.use("/users", userRoutes);
app.use("/rooms", roomRoutes);

// Add this line to serve uploaded files
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("API");
});

// const CONNECTION_URL = process.env.CONNECTION_URL;
const CONNECTION_URL ="mongodb+srv://pratham:nE6ma2bjjSJ5ZVRh@cluster0.cojuu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

console.log(CONNECTION_URL);

const PORT = process.env.PORT || 5000;

mongoose.set('strictQuery', true); 
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const server = app.listen(PORT, () =>
      console.log(`Server running on port: ${PORT}`)
    );
    const io = new Server(server, {
      cookie: false,
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      socket.on("join", ({ userId, name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, userId, name, room });

        if (error) return callback(error);

        socket.join(user.room);

        callback();
      });

      socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit("message", {
          senderId: user.userId,
          sender: user.name,
          message: message,
          timestamp: new Date(),
        });

        callback();
      });

      socket.on("typing", () => {
        socket.broadcast.emit("typing");
      });

      socket.on("stop-typing", () => {
        socket.broadcast.emit("stop-typing");
      });

      socket.on("call", () => {
        socket.broadcast.emit("call");
      });

      socket.on("disconnect", () => {
        removeUser(socket.id);
      });
    });
  })
  .catch((error) => console.log(error.message));
