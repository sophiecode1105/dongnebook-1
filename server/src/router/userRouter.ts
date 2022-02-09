import express from "express";
import nodemailer from "nodemailer";

import { postCertify } from "../controllers/userController";
const userRouter = express.Router();

userRouter.route("/join").post();
userRouter.route("/certify").post(postCertify);
userRouter.route("/nickcheck").post();

userRouter.route("/login").get();
userRouter.route("/logout").get();
userRouter.route("/delete").delete();
userRouter.route("/mypage").get();

export default userRouter;
