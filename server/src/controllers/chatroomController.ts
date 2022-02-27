import { createServer } from "http";
import { JwtPayload } from "jsonwebtoken";
import { Server } from "socket.io";
import server from "../app";
import client from "../client";
import { userFinder, verify } from "../token/verify";

const httpServer = createServer();

// export const live = (req: any, res: any, next: any) => {
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true,
  },
});

let count = {};

function publicRooms(id: any) {
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

  socket.on("notification", async (done: any) => {
    socket.join("notification");
    done();
  });

  socket.on("enter_room", async (productId: string, done: any) => {
    const { token } = socket.handshake.auth;
    const userInfo: JwtPayload | any = verify(token);
    console.log("몇명있나");
    console.log(io.sockets.adapter.rooms);
    if (userInfo === undefined) {
      return console.log("토큰이 없습니다.");
    }
    socket.leave("notification");

    socket.join(productId);

    count[productId] = io.sockets.adapter.rooms.get(productId)?.size;

    let chatroomFind = await client.chatroom.findMany({
      where: {
        productId: Number(productId),
        users: {
          some: {
            userId: userInfo.id,
          },
        },
      },
    });
    const productInfo = await client.product.findUnique({
      where: { id: Number(productId) },
      include: { images: true },
    });

    if (chatroomFind.length !== 0) {
      await client.chatroom.update({
        where: {
          id: chatroomFind[0].id,
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
          id: chatroomFind[0].id,
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
          chats: true,
          product: {
            include: {
              images: true,
            },
          },
        },
      });
      done(productInfo, chatroom[0]);
    } //채팅방이 있을때
    //채팅방이 없을때는

    done(productInfo);
  });

  socket.on("new_message", async (productId: string, name: string, content: string, done: any) => {
    const { token } = socket.handshake.auth;
    const userInfo: JwtPayload | any = verify(token);

    if (userInfo === undefined) {
      return console.log("토큰이 없습니다.");
    }
    const otherInfo = await client.user.findMany({
      where: {
        products: {
          some: {
            id: Number(productId),
          },
        },
      },
    });

    let chatroomFind = await client.chatroom.findMany({
      where: {
        productId: Number(productId),
        users: {
          some: {
            userId: userInfo.id,
          },
        },
      },
    });

    if (chatroomFind.length === 0) {
      chatroomFind[0] = await client.chatroom.create({
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
        chatroomId: chatroomFind[0]["id"],
        read: count[productId] === 2 ? true : false,
      },
    });

    done();
    socket.to("notification").emit("receive_message");
    socket.to(productId).emit("receive_message", name, content);

    console.log("방번호:", productId, "이름", name, "내용", content);
  });

  socket.on("out_room", (roomName: string, done) => {
    socket.leave(roomName);
    count[roomName] -= 1;
    console.log("나기가 방");
    done();
  });

  socket.on("delete_room", async (productId: string) => {
    const { token } = socket.handshake.auth;
    const userInfo: JwtPayload | any = verify(token);

    if (userInfo === undefined) {
      return console.log("토큰이 없습니다.");
    }
    socket.leave(productId);

    let chatroomFind = await client.chatroom.findMany({
      where: {
        productId: Number(productId),
        users: {
          some: {
            userId: userInfo.id,
          },
        },
      },
    });

    await client.chatroom.deleteMany({
      where: {
        id: chatroomFind[0].id,
      },
    });

    console.log("방 삭제");
  });

  socket.on("get_rooms", async (done: any) => {
    const { token } = socket.handshake.auth;
    const userInfo: JwtPayload | any = verify(token);

    if (userInfo === undefined) {
      return console.log("토큰이 없습니다.");
    }
    const userData = await userFinder(userInfo["email"]);

    const notReadChat = await client.chatroom.findMany({
      where: {
        users: {
          some: {
            userId: userData.id,
          },
        },
      },
      include: {
        chats: {
          where: {
            userId: {
              not: userData.id,
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
            userId: userData.id,
          },
        },
      },
      include: {
        users: {
          where: {
            users: {
              id: {
                not: userData.id,
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
        product: {
          include: {
            images: true,
          },
        },
      },
    });

    chatroom.forEach((el, idx) => {
      el["count"] = notReadChat[idx].chats.length;
    });

    done(chatroom);
  });

  socket.on("disconnecting", function () {
    const roomName = publicRooms(socket.id);
    socket.leave(roomName);
    console.log("디스커넥팅");
    count[roomName] -= 1;
  });

  socket.on("disconnect", function () {
    console.log("user disconnected: ", socket.id);
  });
});

const PORT = 5000;

httpServer.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
