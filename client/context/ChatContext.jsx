import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);

      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      if (!selectedUser) return toast.error("Please select a user");

      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", async (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;

        setMessages((prev) => [...prev, newMessage]);

        await axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) {
      socket.off("newMessage");
    }
  };

  useEffect(() => {
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [socket, selectedUser]);

  const value = {
    messages,
    setMessages,

    users,
    setUsers,
    getUsers,

    selectedUser,
    setSelectedUser,

    getMessages,
    sendMessage,

    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};