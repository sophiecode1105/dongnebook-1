import { FormEvent, useState, useEffect } from "react";
import styled from "styled-components";
import socketIOClient from "socket.io-client";
import axios from "axios";
const socket = socketIOClient("http://localhost:4000");

const ChatList = styled.section``;
const ChatForm = styled.form``;

interface Message {
  name: string;
  message: string;
}
const Socket = () => {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [roomId, setRoomName] = useState("");
  const click = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    socket.emit("enter_room", roomId);
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("new_message", roomId, name, value, () => {
      setMessageList((messageList) => messageList.concat({ name, message: value }));

      console.log("끝");
    });
  };

  useEffect(() => {
    console.log("유즈이펙트 작동");
    socket.on("receive_message", (name: string, message: string) => {
      console.log(`닉네임 : ${name} 메세지 : ${message}`);
      setMessageList((messageList) => messageList.concat({ name, message }));
    });
  }, []);
  return (
    <div className="App">
      <div>-</div>
      <div>-</div>
      <div>-</div>
      <div>-</div>

      <div className="room name">
        <input placeholder="방 이름을 입력하세요." type="text" onChange={(e: any) => setRoomName(e.target.value)} />
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

export default Socket;
