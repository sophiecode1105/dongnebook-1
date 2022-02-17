import express from "express";

import {
  deleteJoin,
  login,
  mypage,
  nickCheck,
  postCertify,
  postJoin,
  putMypage,
} from "../controllers/userController";
import { upload } from "../middleware/upload";
const userRouter = express.Router();

userRouter.route("/join").post(postJoin);
userRouter.route("/certify").post(postCertify);
userRouter.route("/nickcheck").post(nickCheck);

userRouter.route("/login").post(login);
userRouter.route("/logout").get();
userRouter.route("/delete").delete(deleteJoin);
userRouter.route("/mypage").get(mypage).patch(upload.array("file"), putMypage);

export default userRouter;
