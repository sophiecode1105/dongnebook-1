import axios from "axios";
import jwt from "jsonwebtoken";
import client from "../../client";
import express from "express";

const users = client.user;

export const googleLogin = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.body;
    const {
      data: { access_token },
    } = await axios.post(
      `https://oauth2.googleapis.com/token?code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_SECRET}&redirect_uri=http://localhost:3000/signin&grant_type=authorization_code`,
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      },
      { withCredentials: true }
    );

    const {
      data: { email },
    } = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`, {
      headers: {
        authorization: `token ${access_token}`,
        accept: "application/json",
      },
    });

    let user = await users.findUnique({
      where: { email },
    });

    if (!user) {
      await client.location.create({
        data: {
          lat: 37.4965544495086,
          lon: 127.02475418053183,
          address: "서울시 서초구 서초동",
          users: {
            create: {
              nickname: Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .substr(0, 5),
              admin: false,
              email,
              img: "https://practice0210.s3.ap-northeast-2.amazonaws.com/31644921016560.png",
            },
          },
        },
      });
    }
    const token = jwt.sign({ email }, process.env.ACCESS_SECRET, { expiresIn: "24h" });
    return res.status(201).json({ message: "구글 소셜 로그인 성공", id: user.id, token, state: true });
  } catch (e) {
    console.log(e);
  }
};
