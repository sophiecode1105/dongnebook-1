import React, { FormEvent, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import socketIOClient from "socket.io-client";
import { BlockList } from "net";
import { getBookList } from "../api";

const ChatList = styled.section`
  /* display: none; */
  /* background-color: black; */
`;
const ChatForm = styled.form`
  /* display: none; */
  /* background-color: black; */
`;

interface Message {
  name: string;
  message: string;
}

const SocketTest: React.FC = () => {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [roomName, setRoomName] = useState("");
  const socket = useRef<any>(null);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.current.emit("new_message", roomName, name, value, () => {
      setMessageList((messageList) => messageList.concat({ name, message: value }));

      console.log("끝");
    });
  };
  const click = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    socket.current.emit("enter_room", roomName, () => {});
    socket.current.on("welcome", () => {
      console.log(`SomeOne joined !`);
    });
  };

  useEffect(() => {
    console.log("유즈이펙트 작동");

    socket.current = socketIOClient("http://localhost:5000", {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("token") },
    });
  }, []);
  return (
    <div className="App">
      <div>-</div>
      <div>-</div>
      <div>-</div>
      <div>-</div>

      <div className="room name">
        <input
          placeholder="방 이름을 입력하세요."
          type="text"
          onChange={(e: any) => setRoomName(e.target.value)}
        />
        <button onClick={(e: FormEvent<HTMLElement>) => click(e)}>방 입잡하기</button>
      </div>
      <ChatList>
        <div className="message">
          {messageList.map((item: Message, i: number) => (
            <div key={i} className="message">
              <p className="username">{item.name}</p>
              <p className="message-text">{item.message}</p>
            </div>
          ))}
        </div>
      </ChatList>
      <ChatForm onSubmit={(e: FormEvent<HTMLFormElement>) => submit(e)}>
        <div className="chat-inputs">
          <input
            type="text"
            autoComplete="off"
            onChange={(e: any) => setName(e.target.value)}
            value={name}
            placeholder="유저이름"
          />
          <input
            type="text"
            autoComplete="off"
            onChange={(e: any) => setValue(e.target.value)}
            value={value}
            placeholder="메세지입력하기"
          />
        </div>
        <button type="submit">입력하기</button>
      </ChatForm>
    </div>
  );
};

export default SocketTest;
