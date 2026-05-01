import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// Get all users for sidebar except logged-in user
const GetUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: userId },
    }).select("-password");

    const unseenMessages = {};

    await Promise.all(
      filteredUsers.map(async (user) => {
        const count = await Message.countDocuments({
          senderId: user._id,
          receiverId: userId,
          seen: false,
        });

        if (count > 0) {
          unseenMessages[user._id] = count;
        }
      })
    );

    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get all messages with selected user
const getMessages = async (req, res) => {
  try {
    const selectedUserId = req.params.id;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      {
        senderId: selectedUserId,
        receiverId: myId,
        seen: false,
      },
      {
        $set: { seen: true },
      }
    );

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Mark one message as seen
const MarkMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, {
      seen: true,
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl = "";

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export {
  GetUsersForSidebar,
  getMessages,
  MarkMessageAsSeen,
  sendMessage,
};