import express from "express";
import { getchatroom } from "../controllers/chatroomController";

const chatroomRouter = express.Router();

chatroomRouter.route("/").get(getchatroom);

export default chatroomRouter;
