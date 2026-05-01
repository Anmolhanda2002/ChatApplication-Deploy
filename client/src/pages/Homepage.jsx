import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RIgheSibar from "../components/RIgheSibar";
import { ChatContext } from "../../context/ChatContext";

const Homepage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`
          w-full h-screen grid bg-white/5 backdrop-blur-2xl
          border border-white/10 shadow-2xl overflow-hidden
          ${
            selectedUser
              ? "grid-cols-1 md:grid-cols-[300px_1fr] xl:grid-cols-[300px_1fr_340px]"
              : "grid-cols-1 md:grid-cols-[300px_1fr]"
          }
        `}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="sidebar"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`
              h-full border-r border-white/10 bg-[#141b2d]/80 backdrop-blur-xl
              ${selectedUser ? "hidden md:block" : "block"}
            `}
          >
            <Sidebar />
          </motion.div>
        </AnimatePresence>

        <motion.div
          key="chat-container"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`
            h-full bg-[#0b1120]/40 backdrop-blur-xl
            ${selectedUser ? "block" : "hidden md:block"}
          `}
        >
          <ChatContainer />
        </motion.div>

        <AnimatePresence>
          {selectedUser && (
            <motion.div
              key="right-sidebar"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="hidden xl:block h-full border-l border-white/10 bg-[#141b2d]/70 backdrop-blur-xl"
            >
              <RIgheSibar selectedUser={selectedUser} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Homepage;