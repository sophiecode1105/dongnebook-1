import express from "express";
import { deleteChatroom, enterChatroom, getchatroom, postChat, postChatroom } from "../controllers/chatroomController";

const chatroomRouter = express.Router();

chatroomRouter.route("/").get(getchatroom).post(postChatroom);
chatroomRouter.route("/:id/chat").post(postChat);

chatroomRouter.route("/:id").get(enterChatroom).delete(deleteChatroom);
export default chatroomRouter;
