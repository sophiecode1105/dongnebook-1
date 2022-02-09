import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./router/userRouter";
import locationRouter from "./router/locationRouter";

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
app.use("/location", locationRouter);
app.use("/user", userRouter);
// db.sequelize.sync();

export default app;
