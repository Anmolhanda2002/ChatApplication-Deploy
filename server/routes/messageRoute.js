import express  from "express"
import { protectRoute } from "../middleware/auth.js"
import { getMessages, GetUsersForSidebar, MarkMessageAsSeen, sendMessage } from "../controller/message.controller.js";

const messageRouter =  express.Router();

messageRouter.get("/users",protectRoute,GetUsersForSidebar)
messageRouter.get("/:id",protectRoute,getMessages)
messageRouter.put("/mark/:id",protectRoute , MarkMessageAsSeen)
messageRouter.post("/send/:id",protectRoute,sendMessage)

export default messageRouter;