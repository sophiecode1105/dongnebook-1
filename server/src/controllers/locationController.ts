import express from "express";
import client from "../client";

// export const postLocation = async (req: express.Request, res: express.Response) => {
//   try {
//     const { lat, lon } = req.body;
//     const locationInfo = await client.location.create({
//       data: {
//         lat,
//         lon,
//       },
//     });
//     return res.status(201).json({ message: "위치저장 완료", state: true, locationInfo });
//   } catch {
//     return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
//   }
// };
