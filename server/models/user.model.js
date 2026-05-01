import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profilepic: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 250,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;