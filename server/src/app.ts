import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./router/userRouter";
import productRouter from "./router/productRouter";
import http from "http";
// import { live } from "./controllers/chatroomController";
import locationRouter from "./router/locationRouter";
import oauthRotuer from "./router/oauthRouter";
import { instrument } from "@socket.io/admin-ui";

const socketIo = require("socket.io");

const app = express();
const logger = morgan("dev");
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(logger);

const server = http.createServer(app);

// app.use(live);

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/location", locationRouter);
app.use("/oauth", oauthRotuer);

export default server;
