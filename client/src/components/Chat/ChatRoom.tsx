import { FormEvent, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { timeStamp, socket } from "../../api";
import { chatRoomFrame, chatRoomsState, chatRoomVisible, userState } from "../../state/state";
import { Chat } from "../../state/typeDefs";

const ChatRoom = () => {
  const setVisible = useSetRecoilState(chatRoomVisible);
  const frame = useRecoilValue(chatRoomFrame);
  const myInfo = useRecoilValue(userState);
  const [message, setMessage] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>(frame.chats as Chat[]);
  const setChatRooms = useSetRecoilState(chatRoomsState);

  const outRoom = () => {
    socket.emit("out_room", frame.productId, () => {
      setVisible(false);
      socket.emit("notification");
      socket.emit("get_rooms", (data: any) => {
        setChatRooms(data);
      });
    });
  };

  const submitMessage = async (e: FormEvent) => {
    e.preventDefault();

    socket.emit("new_message", frame.productId, myInfo.nickname, message, (data: any) => {
      setChats(data.chats);
      setMessage("");
      const ul: any = document.querySelector("#chat__list");
      const height = ul.scrollHeight;
      ul.scrollTo({ top: height });
    });
  };

  useEffect(() => {
    socket.on("receive_message", (data: any) => {
      setChats(data.chats);
      const ul: any = document.querySelector("#chat__list");
      if (ul) {
        const height = ul.scrollHeight;
        ul.scrollTo({ top: height });
      }
    });
    const ul: any = document.querySelector("#chat__list");
    const height = ul.scrollHeight;
    ul.scrollTo({ top: height });
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[51] w-full h-screen bg-opacity-20 bg-black flex justify-center items-center">
      <div onClick={outRoom} className="w-screen h-screen"></div>
      <div className="max-w-md w-full h-screen md:h-[80vh] bg-white z-[52] absolute flex flex-col justify-between">
        <div className="p-3 chatroom--shadow">
          <div className="flex justify-between mb-3 text-xl">
            <i onClick={outRoom} className="fas fa-arrow-left cursor-pointer "></i>
            <h1 className="font-bold">{frame.nickname}</h1>
            <i className="fas fa-sign-out-alt cursor-pointer"></i>
          </div>
          <div className="flex">
            <img src={frame.bookImg} alt={frame.title} className="w-28 h-32 mr-3" />
            <h2 className="flex items-center">{frame.title}</h2>
          </div>
        </div>
        <ul className="h-full overflow-y-scroll p-3" id="chat__list">
          {chats?.map((chat, idx) =>
            myInfo.id === chat.userId ? (
              <li className="flex justify-end items-end mb-2" key={idx}>
                <span className="mr-2">{timeStamp(chat.createdAt)}</span>
                <p className="break bg-slate-200 rounded-b-lg rounded-tl-lg p-2">{chat.content}</p>
              </li>
            ) : (
              <li className="flex flex-col items-start mb-2" key={idx}>
                <div className="flex items-center">
                  <img src={frame.img} alt={frame.nickname} className="w-10 h-10 rounded-full mb-2" />
                  <h1>{frame.nickname}</h1>
                </div>
                <div className="flex items-end">
                  <p className="break bg-slate-200 rounded-b-lg rounded-tr-lg p-2">{chat.content}</p>
                  <span className="ml-2">{timeStamp(chat.createdAt)}</span>
                </div>
              </li>
            )
          )}
        </ul>
        <form className="bg-slate-100 w-full h-20 flex justify-center items-center px-2" onSubmit={submitMessage}>
          <input
            type="text"
            className="rounded-full w-4/5 h-3/4 p-2 placeholder:text-xs mr-2"
            placeholder="메시지를 입력하세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="bg-green-100 font-bold w-20 h-3/4 rounded-2xl">
            전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
