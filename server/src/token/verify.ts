import jwt from "jsonwebtoken";
import client from "../client";
// type Verify = (token: string) => { any };

export function verify(token: string): string | jwt.JwtPayload {
  console.log("토큰");
  console.log(token);
  const data = jwt.verify(token, process.env.ACCESS_SECRET);
  console.log("데이타");
  console.log(data);
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
