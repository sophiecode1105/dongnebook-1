import axios from "axios";
import jwt from "jsonwebtoken";
import client from "../../client";
import express from "express";
const users = client.user;

export const githubLogin = async (req: express.Request, res: express.Response) => {
  const { code } = req.body;
  const {
    data: { access_token },
  } = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_SECRET,
      code,
    },
    {
      headers: { accept: "application/json" },
    }
  );
  const { data } = await axios.get(" https://api.github.com/user/emails", {
    headers: {
      Authorization: `token ${access_token}`,
    },
  });

  const { email } = data.find((email) => email.primary === true && email.verified === true);

  let userInfo = await users.findUnique({
    where: { email },
  });
  const nickname = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);

  if (!userInfo) {
    await client.location.create({
      data: {
        lat: 37.4965544495086,
        lon: 127.02475418053183,
        address: "서울시 서초구 서초동",
        users: {
          create: {
            nickname,
            admin: false,
            email,
            img: "https://practice0210.s3.ap-northeast-2.amazonaws.com/31644921016560.png",
          },
        },
      },
    });
  }

  userInfo = await users.findUnique({
    where: { email },
  });
  const token = jwt.sign({ id: userInfo.id, email, nickname }, process.env.ACCESS_SECRET, {
    expiresIn: "24h",
  });

  return res.status(201).json({ message: "깃헙 소셜 로그인 성공", userInfo, token, state: true });
};
