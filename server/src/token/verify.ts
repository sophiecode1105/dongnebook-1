import jwt from "jsonwebtoken";
import client from "../client";
// type Verify = (token: string) => { any };

export function verify(token: string): string | jwt.JwtPayload {
  const data = jwt.verify(token, process.env.ACCESS_SECRET);

  return data;
}

export async function userFinder(email: string) {
  const userInfo = await client.user.findUnique({
    where: {
      email,
    },
  });
  return userInfo;
}

export async function userNickFinder(nickname: string) {
  const userInfo = await client.user.findUnique({
    where: {
      nickname,
    },
  });
  return userInfo;
}
