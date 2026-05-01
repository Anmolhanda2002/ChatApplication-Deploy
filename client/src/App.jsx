import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/loginpage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const App = () => {
  const { authUser, isCheckingAuth } = useContext(AuthContext);

  if (isCheckingAuth) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className='bg-[url("./assets/bgImage.svg")] bg-contain'>
      <Toaster />

      <Routes>
        <Route path="/" element={authUser ? <Homepage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <Loginpage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App