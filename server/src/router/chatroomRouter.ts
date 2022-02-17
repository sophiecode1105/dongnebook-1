import express from "express";
import {
  deleteChatroom,
  enterChatroom,
  getchatroom,
  postChat,
  postChatroom,
} from "../controllers/chatroomController";

const chatroomRouter = express.Router();

chatroomRouter.route("/").get(getchatroom);
chatroomRouter.route("/:id/chat").post(postChat);
chatroomRouter.route("/:id").post(postChatroom).get(enterChatroom).delete(deleteChatroom);
export default chatroomRouter;
