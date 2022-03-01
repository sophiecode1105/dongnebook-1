import express from "express";
import { githubLogin } from "../controllers/oauth/githubcontroller";
import { googleLogin } from "../controllers/oauth/googlecontroller";

const oauthRotuer = express.Router();

oauthRotuer.post("/google", googleLogin);

oauthRotuer.post("/github", githubLogin);

export default oauthRotuer;
