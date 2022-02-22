import express from "express";
import { getLocation } from "../controllers/locationController";

const locationRouter = express.Router();

locationRouter.route("/").get(getLocation);

export default locationRouter;
