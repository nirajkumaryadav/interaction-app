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
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL }));

app.use("/users", userRoutes);
app.use("/rooms", roomRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose.set('strictQuery', true);
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
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
      console.log("A user connected:", socket.id);

      socket.on("join", ({ userId, name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, userId, name, room });

        if (error) return callback(error);

        socket.join(user.room);
        console.log(`${user.name} joined room: ${user.room}`);
        callback();
      });

      socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        if (!user) {
          return callback("User not found");
        }

        io.to(user.room).emit("message", {
          senderId: user.userId,
          sender: user.name,
          message: message,
          timestamp: new Date(),
        });

        console.log(`Message sent by ${user.name} in room ${user.room}: ${message}`);
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
        const user = removeUser(socket.id);
        if (user) {
          console.log(`${user.name} disconnected`);
        }
      });
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });