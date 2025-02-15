import bcrypt from "bcrypt";
import User from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist." });
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    res.status(200).json({ result: existingUser });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  console.log("Signup request received:", req.body); // Add this line
  try {
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      console.log("User already exists"); // Add this line
      return res.status(400).json({ message: "User already exists." });
    }
    if (password !== confirmPassword) {
      console.log("Passwords don't match"); // Add this line
      return res.status(400).json({ message: "Passwords don't match." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      name: `${firstName.trim()} ${lastName.trim()}`,
    });
    console.log("User registered successfully"); // Add this line
    res.status(201).json({ message: "User Registered. Login to continue!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name _id email");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: error.message });
  }
};
