import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { authUser, updateProfile, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    fullname: authUser?.fullname || "",
    bio: authUser?.bio || "",
    profilePic: authUser?.profilePic || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateProfile({
      fullname: profile.fullname,
      bio: profile.bio,
      profilePic: profile.profilePic,
    });

    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6"
      >
        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-6 sm:p-8 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Edit Profile</h1>
              <p className="text-sm text-gray-300 mt-2">
                Update your personal information and profile photo
              </p>
            </div>

            <button
              onClick={handleLogout}
              type="button"
              className="rounded-xl bg-red-500/20 border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/30 transition"
            >
              Logout
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm text-gray-300">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={profile.fullname}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm placeholder-gray-400 focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows="5"
                className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm placeholder-gray-400 focus:border-violet-500 resize-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Profile Image URL</label>
              <input
                type="text"
                name="profilePic"
                value={profile.profilePic}
                onChange={handleChange}
                placeholder="Paste image URL"
                className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm placeholder-gray-400 focus:border-violet-500"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition"
            >
              Save Profile
            </motion.button>
          </form>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-6 text-white flex flex-col items-center justify-center text-center"
        >
          <div className="relative">
            <img
              src={profile.profilePic || assets.avatar_icon}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-violet-500/40 shadow-xl"
            />
            <span className="absolute bottom-2 right-3 w-5 h-5 rounded-full bg-green-500 border-4 border-[#1e1b4b]" />
          </div>

          <h2 className="mt-5 text-2xl font-bold">{profile.fullname}</h2>
          <p className="mt-3 text-sm text-gray-300 leading-6 max-w-xs">
            {profile.bio}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;