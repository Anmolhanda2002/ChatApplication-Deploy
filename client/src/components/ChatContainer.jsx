import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const scrollEnd = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    await sendMessage({
      text: input.trim(),
    });

    setInput("");
  };

  return (
    <AnimatePresence mode="wait">
      {selectedUser ? (
        <motion.div
          key="chat-screen"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="h-full flex flex-col bg-[#141b2d] relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-white/10 bg-[#1c2438]/90 backdrop-blur-xl">
            <button
              onClick={() => setSelectedUser(null)}
              className="md:hidden text-white text-xl mr-1"
            >
              ←
            </button>

            <div className="relative">
              <img
                src={selectedUser?.profilePic || assets.avatar_icon}
                alt="user"
                className="w-10 h-10 rounded-full object-cover border border-white/10"
              />

              {onlineUsers?.includes(selectedUser._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1c2438]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm sm:text-base truncate">
                {selectedUser?.fullname || "User"}
              </p>

              {onlineUsers?.includes(selectedUser._id) ? (
                <p className="text-xs text-green-400 mt-1">Online</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">Offline</p>
              )}
            </div>

            <img
              src={assets.help_icon}
              alt="help"
              className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 transition"
            />
          </div>

          <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderId === authUser?._id;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl max-w-[80%] sm:max-w-[70%] text-sm shadow-lg ${
                      isMe
                        ? "bg-violet-600 text-white rounded-br-sm"
                        : "bg-[#283046] text-white rounded-bl-sm"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="message"
                        className="max-w-52 rounded-xl mb-2"
                      />
                    )}

                    {msg.text && <p>{msg.text}</p>}
                  </div>
                </div>
              );
            })}

            <div ref={scrollEnd} />
          </div>

          <div className="relative z-10 p-3 sm:p-4 border-t border-white/10 bg-[#1c2438]/95 backdrop-blur-xl">
            <div className="flex items-center gap-3 bg-[#283046] rounded-full px-4 py-3 border border-transparent focus-within:border-violet-500/40 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-400"
              />

              <img
                onClick={handleSendMessage}
                src={assets.send_button || assets.search_icon}
                alt="send"
                className="w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="empty-chat"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35 }}
          className="hidden md:flex h-full flex-col items-center justify-center gap-4 bg-[#141b2d] text-gray-400 relative overflow-hidden"
        >
          <img src={assets.logo_icon} className="w-16 relative z-10" alt="logo" />

          <p className="text-xl font-semibold text-white relative z-10">
            Chat Anytime Anywhere
          </p>

          <p className="text-sm text-gray-500 relative z-10">
            Select a conversation to start messaging
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatContainer;