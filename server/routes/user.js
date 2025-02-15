import express from "express";
import { getUsers, signin, signup } from "../controllers/user.js";

const router = express.Router();
router.post("/signin", signin);
router.post("/signup", signup); // Ensure this line is present
router.get("/get-users", getUsers);

export default router;
