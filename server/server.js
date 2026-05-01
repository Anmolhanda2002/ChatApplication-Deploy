import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDb } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoute.js";
import {Server} from "socket.io"

//create express app and http server
const app = express();
const server = http.createServer(app)

export const io =  new Server(server,{
    cors:{origin:"*"}
    
})

export const userSocketMap = {};

io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
console.log("User Connected",userId)

if(userId){
    userSocketMap[userId] = socket.id
}
io.emit("getOnlineUsers", Object.keys(userSocketMap));

socket.on("disconnect",()=>{
    console.log("user Disconnected ",userId)
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
})
})


//setup middleware
app.use(express.json({limit:"4mb"}))
app.use(cors());


//connection db
try {
    await connectDb();
    console.log("Database connected successfully");
} catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
}




app.use("/api/status",(req,res)=>res.send("Server is Live"))
const PORT  = process.env.PORT || 5000


// routes
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);

server.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});