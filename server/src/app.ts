import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./router/userRouter";
import productRouter from "./router/productRouter";
import locationRouter from "./router/locationRouter";
import chatroomRouter from "./router/chatroomRouter";
import http from "http";

import { instrument } from "@socket.io/admin-ui";
import { SocketOptions } from "dgram";
const socketIo = require("socket.io");
const app = express();
const logger = morgan("dev");
app.use(cookieParser());
app.use(express.json());

// interface Cookie {
//   maxAge: number;
//   httpOnly: boolean;
//   secure: boolean;
//   sameSite: string;
// }

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(logger);

const server = http.createServer(app);
export const io = socketIo(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true,
  },
});
instrument(io, {
  auth: false,
});

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/chatroom", chatroomRouter);
export default server;
