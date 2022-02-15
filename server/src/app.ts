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
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true,
  },
});
instrument(io, {
  auth: false,
});

io.on("connection", (socket) => {
  socket.onAny((event: SocketOptions) => {
    console.log(`Socket Event : ${event}`);
  });
  socket.on("enter_room", (roomName: number) => {
    // console.log("방입장하기:", socket.id);
    // console.log("방입장하기:", socket.rooms);
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
    // console.log("방입장하기:", socket.rooms);
    // io.emit("receive message", { name: item.name, message: item.message });
  });
  socket.on("new_message", (room: number, name: string, value: string, date: number, done: any) => {
    console.log("방번호:", room);

    socket.to(room).emit("receive_message", name, value, date);
    console.log("이름", name, "내용", value);
    done();
  });

  socket.on("disconnect", function () {
    console.log("user disconnected: ", socket.id);
  });
});

app.use("/location", locationRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/chatroom", chatroomRouter);
export default server;
