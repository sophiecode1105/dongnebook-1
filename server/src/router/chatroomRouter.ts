import express from "express";
import { getchatroom, postChat, postChatroom } from "../controllers/chatroomController";

const chatroomRouter = express.Router();

chatroomRouter.route("/").get(getchatroom);
chatroomRouter.route("/:id").post(postChatroom);
chatroomRouter.route("/chat/:id").post(postChat);
export default chatroomRouter;
