import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

const Loginpage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const { login } = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();
   
   
    const state = isLogin ? "login" : "signup";

    const credentials = isLogin
      ? { email, password }
      : { fullname, email, password, bio };

    await login(state, credentials);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-6 sm:p-8 text-white"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm"
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm"
          />

          {!isLogin && (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself"
              rows="3"
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm resize-none"
            />
          )}

          <button
            type="button"
            onClick={handleLogin}
            className="w-full mt-4 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 py-3 text-sm font-semibold text-white"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </div>

        <p className="text-sm text-center text-gray-300 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-violet-400 font-semibold"
          >
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Loginpage;