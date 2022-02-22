import express from "express";
import { JwtPayload } from "jsonwebtoken";
import client from "../client";
import { verify } from "../token/verify";
export const getLocation = async (req: express.Request, res: express.Response) => {
  try {
    const authorization = req.headers.authorization;
    const productLocation = await client.product.findMany({
      where: {
        exchanged: false,
      },
      include: {
        locations: true,
        images: true,
      },
    });
    let userLocation = { lat: 37.4965544495086, lon: 127.02475418053183, address: "서울시 서초구 서초동" };
    if (authorization.split(" ")[1] !== "null") {
      let userInfo: string | JwtPayload;
      try {
        userInfo = verify(authorization.split(" ")[1]);
        const myInfo = await client.user.findUnique({
          where: {
            id: userInfo["id"],
          },
        });

        userLocation = await client.location.findUnique({
          where: {
            id: myInfo["locationId"],
          },
        });
      } catch (err) {
        return res.status(401).json({ message: "로그인이 다시 필요합니다.", status: false, err });
      }
    }
    return res.status(200).json({ message: "위치정보 전송 완료", userLocation, productLocation, state: true });
  } catch {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};
