import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
/* ---------------- SIGNUP ---------------- */
const signup = async (req, res) => {
  const { fullname, email, password, bio } = req.body;

  try {
    if (!fullname || !email || !password || !bio) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.json({
        success: false,
        message: "Account already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      bio,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    return res.json({
      success: true,
      message: "Signup successful",
      user: newUser,
      token,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ---------------- LOGIN ---------------- */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and Password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: "Server Error",
    });
  }
};



const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullname } = req.body;
    const userId = req.user._id; // make sure auth middleware sets req.user

    let updateData = {
      bio,
      fullname,
    };

    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in updateProfile:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { signup, login ,updateProfile};