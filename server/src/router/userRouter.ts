import express from "express";
import { deleteJoin, login, nickCheck, postCertify, postJoin } from "../controllers/userController";
const userRouter = express.Router();

userRouter.route("/join").post(postJoin);
userRouter.route("/certify").post(postCertify);
userRouter.route("/nickcheck").post(nickCheck);

userRouter.route("/login").post(login);
userRouter.route("/logout").get();
userRouter.route("/delete").delete(deleteJoin);
userRouter.route("/mypage").get();

export default userRouter;
