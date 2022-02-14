import express from "express";
import client from "../client";
import { userFinder, userNickFinder, verify } from "../token/verify";

export const postChatroom = async (req: express.Request, res: express.Response) => {
  try {
    const { token, writer } = req.body;
    const { id } = req.params;
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요한 서비스입니다.", state: false });
    }
    const data = verify(token);
    const userInfo = await userFinder(data["email"]);
    const otherInfo = await userNickFinder(writer);
    const isFind = await client.chatroom.findMany();

    await client.chatroom.create({
      data: {
        users: {
          create: [
            {
              users: {
                connect: {
                  id: userInfo.id,
                },
              },
            },
            {
              users: {
                connect: {
                  id: otherInfo.id,
                },
              },
            },
          ],
        },
        productId: Number(id),
      },
    });

    return res.status(201).json({ message: "챗룸생성 완료", state: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};

export const getchatroom = async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요한 서비스입니다.", state: false });
    }
    const data = verify(token);
    const userInfo = await userFinder(data["email"]);

    const chatroom = await client.chatroom.findMany({
      where: {
        users: {
          some: {
            userId: userInfo.id,
          },
        },
      },
      include: {
        users: {
          include: {
            users: true,
          },
        },
        chats: true,
        product: true,
      },
    });

    return res
      .status(200)
      .json({ message: "채팅방 조회 완료", id: userInfo.id, chatroom, state: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};

export const postChat = async (req: express.Request, res: express.Response) => {
  try {
    const { content, nickname } = req.body;

    const { id } = req.params;

    const chat = await client.chat.create({
      data: {
        nickname,
        content,
        chatroomId: Number(id),
        productId: 1,
      },
    });

    return res.status(200).json({ message: "채팅내역 생성 완료", chat, state: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};

// export const getChat = async (req: express.Request, res: express.Response) => {
//   const { id } = req.params;

//   const chat = await client.chat.findMany({
//     where: {
//       chatroomId: Number(id),
//     },
//   });

//   return res.status(200).json({ message: "채팅내역 조회 완료", chat, state: true });
// };
