import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const userAuthentication = {
  signupUser: async (req, res) => {
    try {
      // Step 1: Extract user details from the request body
      const { name, email, password, confirmPassword, phone } = req.body;

      // Step 2: Validate required fields
      if (
        [name, email, password, confirmPassword, phone].some(
          (field) => !field?.trim()
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (!email.includes("@")) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Passwords do not match",
        });
      }

      // Step 3: Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Step 4: Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Step 5: Create the user in the database
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
      });

      // Generate token
      const token = generateAccessToken(user._id);

      // Step 6: Remove the password from the response
      const createdUser = await User.findById(user._id).select("-password");
      // Return token in the response body
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: createdUser,
        token, // Send the token in the response
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error during user registration",
        error: error.message,
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      // Step 1: Extract email and password from the request body
      const { email, password } = req.body;

      // Step 2: Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Step 3: Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Step 4: Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate token
      const token = generateAccessToken(user._id);

      // Remove password from response
      const loggedInUser = await User.findById(user._id).select("-password");
      user.lastLogin = new Date();

      // Return token in the response body
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: loggedInUser,
        token, // Send the token in the response
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error during user login",
        error: error.message,
      });
    }
  },

  logoutUser: async (req, res) => {
    try {
      // No need to clear cookies since we're not using them
      res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error during user logout",
        error: error.message,
      });
    }
  },
  //get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ totalPoints: -1 })
        .lean();

      // Add position based on sorted order
      const usersWithPosition = users.map((user, index) => ({
        ...user,
        position: index + 1,
      }));

      res.status(200).json({ data: usersWithPosition });
    } catch (error) {
      res.status(500).json({
        message: "Error From Fetch All Users",
        error: error.message,
      });
    }
  },
};

export { userAuthentication };
