import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./router/userRouter";
import productRouter from "./router/productRouter";
import locationRouter from "./router/locationRouter";
import oauthRotuer from "./router/oauthRouter";

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

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/location", locationRouter);
app.use("/oauth", oauthRotuer);

export default app;
