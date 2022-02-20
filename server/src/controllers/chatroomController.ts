import express from "express";
import { JwtPayload } from "jsonwebtoken";
import server from "../app";
import client from "../client";
import { userFinder, verify } from "../token/verify";
import { instrument } from "@socket.io/admin-ui";
const socketIo = require("socket.io");

let count = {};

export const live = (req, res, next) => {
  const io = socketIo(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
      credentials: true,
    },
  });

  instrument(io, {
    auth: false,
  });

  function publicRooms(id) {
    const {
      sockets: {
        adapter: { sids, rooms },
      },
    } = io;

    const publicRooms = [];
    rooms.forEach((room, key) => {
      if (sids.get(key) === undefined) {
        if (room.has(`${id}`)) {
          publicRooms.push(key);
        }
      }
    });

    return publicRooms[0];
  }

  io.on("connection", (socket) => {
    socket.onAny((event: any) => {
      console.log(`Socket Event : ${event}`);
    });
    socket.on("enter_room", (roomName: number) => {
      socket.join(roomName);
      count[roomName] = socket.adapter.rooms.get(roomName)?.size;
    });

    socket.on(
      "new_message",
      (room: number, name: string, value: string, date: number, done: any) => {
        socket.to(room).emit("receive_message", name, value, date);
        console.log("방번호:", room, "이름", name, "내용", value);
        done();
      }
    );

    socket.on("disconnecting", function () {
      const roomName = publicRooms(socket.id);
      count[roomName] -= 1;
    });

    socket.on("disconnect", function () {
      console.log("user disconnected: ", socket.id);
    });
  });

  next();
};

export const postChatroom = async (req: express.Request, res: express.Response) => {
  try {
    const { productId, content } = req.body;
    const authorization = req.headers.authorization;

    let data: string | JwtPayload;
    try {
      data = verify(authorization.split(" ")[1]);
    } catch (err) {
      return res.status(401).json({ message: "로그인이 필요한 서비스입니다.", state: false });
    }

    const userInfo = await userFinder(data["email"]);

    let chatroom = await client.chatroom.findMany({
      where: {
        productId: Number(productId),
        users: {
          some: {
            userId: userInfo.id,
          },
        },
      },
    });
    const otherInfo = await client.user.findMany({
      where: {
        products: {
          some: {
            id: Number(productId),
          },
        },
      },
    });

    if (chatroom.length === 0) {
      chatroom[0] = await client.chatroom.create({
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
                    id: otherInfo[0].id,
                  },
                },
              },
            ],
          },
          productId: Number(productId),
        },
      });
    }

    await client.chat.create({
      data: {
        userId: userInfo["id"],
        content,
        chatroomId: chatroom[0]["id"],
        read: count[productId] === 2 ? true : false,
      },
    });

    return res.status(201).json({ message: "채팅 완료", chatroom: chatroom[0], state: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const getchatroom = async (req: express.Request, res: express.Response) => {
  try {
    const authorization = req.headers.authorization;

    let data;
    try {
      data = verify(authorization.split(" ")[1]);
    } catch (err) {
      return res.status(401).json({ message: "로그인이 필요한 서비스입니다.", state: false });
    }
    const userInfo = await userFinder(data["email"]);

    const notReadChat = await client.chatroom.findMany({
      where: {
        users: {
          some: {
            userId: userInfo.id,
          },
        },
      },
      include: {
        chats: {
          where: {
            userId: {
              not: userInfo.id,
            },
            read: false,
          },
        },
      },
    });

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
          where: {
            users: {
              id: {
                not: userInfo.id,
              },
            },
          },
          select: {
            users: true,
          },
        },
        chats: {
          orderBy: {
            id: "desc",
          },
        },
        product: true,
      },
    });

    chatroom.forEach((el, idx) => {
      el["count"] = notReadChat[idx].chats.length;
    });

    return res
      .status(200)
      .json({ message: "채팅방 조회 완료", id: userInfo.id, chatroom, state: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const enterChatroom = async (req: express.Request, res: express.Response) => {
  try {
    const authorization = req.headers.authorization;

    const { chatroomId } = req.params; //채팅방 id
    let userInfo;

    try {
      userInfo = verify(authorization.split(" ")[1]);
    } catch (err) {
      return res.status(401).json({ message: "로그인이 필요한 서비스입니다.", state: false });
    }

    await client.chatroom.update({
      where: {
        id: Number(chatroomId),
      },
      data: {
        chats: {
          updateMany: {
            where: {
              userId: {
                not: userInfo["id"],
              },
            },
            data: {
              read: true,
            },
          },
        },
      },
    });

    const chatroom = await client.chatroom.findMany({
      where: {
        id: Number(chatroomId),
      },
      include: {
        users: {
          include: {
            users: true,
          },
        },
        chats: {
          orderBy: {
            id: "desc",
          },
        },
        product: true,
      },
    });

    return res.status(200).json({ message: "채팅방 입장 완료", chatroom, state: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const deleteChatroom = async (req: express.Request, res: express.Response) => {
  try {
    const { chatroomId } = req.params; //채팅방 id

    await client.chatroom.deleteMany({
      where: {
        id: Number(chatroomId),
      },
    });

    return res.status(200).json({ message: "채팅방 삭제 완료", state: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};
