import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();

  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout,onlineUsers } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.fullname?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUnseenMessages((prev) => ({
      ...prev,
      [user._id]: 0,
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="h-full p-5 border-r border-white/10 bg-[#1f1b2e]/95 text-white overflow-y-auto backdrop-blur-xl"
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            src={assets.logo}
            alt="logo"
            className="max-w-40"
          />

          <div className="relative py-2">
            <motion.img
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => setMenuOpen((prev) => !prev)}
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 z-20 w-36 p-3 rounded-md bg-[#282142] border border-gray-600 text-gray-100 shadow-lg"
                >
                  <p
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer text-sm hover:text-blue-400 transition"
                  >
                    Edit Profile
                  </p>

                  <hr className="my-2 border-t border-gray-500" />

                  <p
                    onClick={handleLogout}
                    className="cursor-pointer text-sm hover:text-red-400 transition"
                  >
                    Logout
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5 border border-transparent focus-within:border-violet-500/50 transition-all"
        >
          <img src={assets.search_icon} alt="Search" className="w-3" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </motion.div>
      </div>

      <motion.div className="flex flex-col gap-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <motion.div
              key={user._id || index}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectUser(user)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 relative border ${
                selectedUser?._id === user?._id
                  ? "bg-[#282142] border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                  : "bg-transparent border-transparent hover:bg-[#282142]/80"
              }`}
            >
              <div className="relative">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt={user?.fullname || "user"}
                  className="w-[45px] h-[45px] rounded-full object-cover"
                />

                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[#1f1b2e]" />
                )}
              </div>

              <div className="flex flex-col leading-5 flex-1 min-w-0">
                <p className="font-medium text-sm text-white truncate">
                  {user.fullname}
                </p>

                {onlineUsers.includes(user._id) ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-gray-400 text-xs">Offline</span>
                )}
              </div>

              {unseenMessages?.[user._id] > 0 && (
                <p className="text-xs min-h-5 min-w-5 px-1 flex justify-center items-center rounded-full bg-violet-500 text-white">
                  {unseenMessages[user._id]}
                </p>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center text-sm text-gray-400 mt-8">
            No users found
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;