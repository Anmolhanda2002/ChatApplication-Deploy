import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { io }from "socket.io-client"
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.log("Check auth error:", error);
      setAuthUser(null);
      toast.error(error.message)
    }
  };


  //login function to handle user authetication 
 const login = async (state, credentials) => {
  try {
    const { data } = await axios.post(`/api/auth/${state}`, credentials);

    if (data.success) {
      setAuthUser(data.user); // not userData if backend sends user
      connectSocket(data.user);

      axios.defaults.headers.common["token"] = data.token;
      setToken(data.token);
      localStorage.setItem("token", data.token);

      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  const logout = async()=>{
    localStorage.removeItem("token")
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null
    toast.success("logout Successfully")
    socket?.disconnect();
  }

  //update the function 

  const updateProfile = async (body)=>{
    try{
        const {data} = await axios.put("/api/auth/update-profile",body)
        setAuthUser(data.user)
        toast.success("Profile Update Successfully")
    }catch(error){
        toast.error(error.message)
    }
  }



 

useEffect(() => {
  if (socket) {
    socket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    return () => socket.off("getOnlineUsers");
  }
}, [socket]);

const connectSocket = (userData)=>{
if(!userData || socket?.connected)return ;
const newSocket = io(backendUrl,{
    query:{
        userId:userData._id
    }
});
newSocket.connect();
setSocket(newSocket);
newSocket.on("getonlineuser",(userIds)=>{
    setOnlineUsers(userIds)
})
}


  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    } else {
      delete axios.defaults.headers.common["token"];
      setAuthUser(null);
    }
  }, [token]);

  const value = {
    axios,
    token,
    setToken,
    authUser,
    setAuthUser,
    onlineUsers,
    setOnlineUsers,
    socket,
     onlineUsers,
    setSocket,login,logout,updateProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};