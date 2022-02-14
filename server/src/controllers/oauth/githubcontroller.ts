import axios from "axios";
import jwt from "jsonwebtoken";
import client from "../../client";

const users = client.user;

export const githubLogin = async (req, res) => {
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

  let user = await users.findUnique({
    where: { email },
  });
  const nickname = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);
  if (!user) {
    user = await users.create({
      data: {
        email: "string",
        nickname,
        admin: false,
      },
    });
  }

  const token = jwt.sign({ email }, process.env.ACCESS_SECRET, {
    expiresIn: "24h",
  });

  return res.status(201).json({ message: "깃헙 소셜 로그인 성공", id: user.id, token, state: true });
};
