"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const client_1 = __importDefault(require("./client"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verify(token) {
    try {
        const data = jsonwebtoken_1.default.verify(token, process.env.ACCESS_SECRET);
        return data;
    }
    catch (_a) {
        return;
    }
}
function userFinder(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userInfo = yield client_1.default.user.findUnique({
                where: {
                    email,
                },
            });
            return userInfo;
        }
        catch (_a) {
            return;
        }
    });
}
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
        credentials: true,
    },
});
let count = {};
function publicRooms(id) {
    const { sockets: { adapter: { sids, rooms }, }, } = io;
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
    socket.onAny((event) => {
        console.log(`Socket Event : ${event}`);
    });
    socket.on("notification", () => __awaiter(void 0, void 0, void 0, function* () {
        socket.join("notification");
    }));
    socket.on("enter_room", (productId, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { token } = socket.handshake.auth;
        const userInfo = verify(token);
        if (userInfo === undefined) {
            return console.log("토큰이 없습니다.");
        }
        socket.leave("notification");
        socket.join(productId);
        count[productId] = (_a = io.sockets.adapter.rooms.get(productId)) === null || _a === void 0 ? void 0 : _a.size;
        let chatroomFind = yield client_1.default.chatroom.findMany({
            where: {
                productId: Number(productId),
                users: {
                    some: {
                        userId: userInfo.id,
                    },
                },
            },
        });
        const productInfo = yield client_1.default.product.findUnique({
            where: { id: Number(productId) },
            include: { images: true },
        });
        if (chatroomFind.length !== 0) {
            yield client_1.default.chatroom.update({
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
            const chatroom = yield client_1.default.chatroom.findMany({
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
        console.log("몇명있나");
        console.log(io.sockets.adapter.rooms);
    }));
    socket.on("new_message", (productId, name, content, done) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = socket.handshake.auth;
        const userInfo = verify(token);
        if (userInfo === undefined) {
            return console.log("토큰이 없습니다.");
        }
        const otherInfo = yield client_1.default.user.findMany({
            where: {
                products: {
                    some: {
                        id: Number(productId),
                    },
                },
            },
        });
        let chatroomFind = yield client_1.default.chatroom.findMany({
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
            chatroomFind[0] = yield client_1.default.chatroom.create({
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
        yield client_1.default.chat.create({
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
    }));
    socket.on("out_room", (roomName, done) => {
        socket.leave(roomName);
        count[roomName] -= 1;
        console.log("나기가 방");
        done();
    });
    socket.on("delete_room", (productId) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = socket.handshake.auth;
        const userInfo = verify(token);
        if (userInfo === undefined) {
            return console.log("토큰이 없습니다.");
        }
        socket.leave(productId);
        try {
            let chatroomFind = yield client_1.default.chatroom.findMany({
                where: {
                    productId: Number(productId),
                    users: {
                        some: {
                            userId: userInfo.id,
                        },
                    },
                },
            });
            yield client_1.default.chatroom.deleteMany({
                where: {
                    id: chatroomFind[0].id,
                },
            });
            console.log("방 삭제");
        }
        catch (err) {
            console.log(err);
        }
    }));
    socket.on("get_rooms", (done) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = socket.handshake.auth;
        const userInfo = verify(token);
        if (userInfo === undefined) {
            return console.log("토큰이 없습니다.");
        }
        const userData = yield userFinder(userInfo["email"]);
        const notReadChat = yield client_1.default.chatroom.findMany({
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
        const chatroom = yield client_1.default.chatroom.findMany({
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
    }));
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
