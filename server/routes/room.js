import express from "express";
import multer from "multer";
import { 
  getRooms, 
  getRoom, 
  createRoom, 
  addUserInRoom, 
  removeUserFromRoom, 
  postMessage, 
  deleteRoom,
  editRoom,
  uploadFile // Add this new controller
} from "../controllers/room.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Files will be stored in uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Room routes
router.get("/:userid", getRooms);
router.get("/:userid/:id", getRoom);
router.post("/:userid", createRoom);
router.post("/:userid/:id/delete-room", deleteRoom);
router.post("/:userid/:id/edit-room", editRoom);
router.patch("/:userid/:id/add-user", addUserInRoom);
router.patch("/:userid/:id/remove-user", removeUserFromRoom);

// Message routes
router.post("/:userid/:id/message", postMessage);

// Add new file upload route
router.post("/:userid/:id/upload", upload.single('file'), uploadFile);

export default router;
