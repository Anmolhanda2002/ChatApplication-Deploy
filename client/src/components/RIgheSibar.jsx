import React from "react";
import { motion } from "framer-motion";
import assets, { imagesDummyData } from "../assets/assets";

const RIgheSibar = ({ selectedUser }) => {
  if (!selectedUser) return null;

  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="h-screen w-full bg-[#181827] text-white relative flex flex-col overflow-hidden"
    >
      {/* Scroll Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-28">
        {/* Profile */}
        <div className="pt-10 sm:pt-14 flex flex-col items-center gap-3 text-xs font-light">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt={selectedUser?.fullName || "user"}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-white/10"
          />

          <h1 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-center">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {selectedUser.fullName}
          </h1>

          <p className="text-center text-gray-300 leading-5 max-w-[260px]">
            {selectedUser.bio || "No bio available"}
          </p>
        </div>

        <hr className="my-6 border-gray-700" />

        {/* Media */}
        <div>
          <p className="mb-3 text-sm text-gray-300 font-medium">Media</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-3">
            {imagesDummyData?.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => window.open(image, "_blank")}
                className="cursor-pointer overflow-hidden rounded-xl bg-white/10 border border-white/5"
              >
                <img
                  src={image}
                  alt={`media-${index}`}
                  className="w-full h-24 sm:h-28 xl:h-24 object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 w-full p-5 bg-[#181827]/90 backdrop-blur-xl">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white border-none text-sm font-medium py-3 rounded-full cursor-pointer shadow-lg"
        >
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RIgheSibar;