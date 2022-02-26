import express from "express";
import {
  deleteChatroom,
  enterChatroom,
  getchatroom,
  postChatroom,
} from "../controllers/chatroomController";

const chatroomRouter = express.Router();

chatroomRouter.route("/").get(getchatroom).post(postChatroom);

chatroomRouter.route("/:chatroomId").get(enterChatroom).delete(deleteChatroom);
export default chatroomRouter;
