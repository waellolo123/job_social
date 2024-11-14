import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

export const register = async (req, res) => {
  const {name, username, email, password} = req.body;
  try {
    if(!name || !username || !password || !email){
      return res.status(400).json({msg: "Please fill in all fields."});
    }
    const existingEmail = await User.findOne({email});
    if(existingEmail) {
      return res.status(400).json({message: "email already exists"});
    }
    const existingUsername = await User.findOne({username});
    if(existingUsername) {
      return res.status(400).json({message: "username already exists"});
    }
    if(password.length < 6) {
      return res.status(400).json({message: "password too short"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword
    });
    await user.save();

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "15d"})
    res.cookie("jwt-linkedin", token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure_: process.env.NODE_ENV === "production"
    });

    res.status(201).json({message: "user created successfully"});

    // send welcome email

    const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;

    try {
      await sendWelcomeEmail(user.email, user.name, profileUrl);
    } catch (error) {
      console.log("error sending welcome email", error);
    }

  } catch (error) {
    console.log("Error in the regsiter", error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
}

export const login = async (req, res) => {
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user) {
      return res.status(400).json({message: "username or password is incorrect"});
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword) {
      return res.status(400).json({message: "username or password is incorrect"});
    }
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"});
    await res.cookie("jwt-linkedin", token, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 24 * 1000,
      sameSite: "strict",
      secure_: process.env.NODE_ENV === "production"
    });
    res.json({message: "user logged in successfully"});
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({message: "Server error"});
  }
}

export const logout = async (req, res) => {
  res.clearCookie("jwt-token");
  res.json({message: "User logged out"});
}


export const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("error in getCurrentUser", error);
    res.status(500).json({message: "Server error"});
  }
}

