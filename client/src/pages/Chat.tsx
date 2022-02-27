import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { socket } from "../api";
import ChatList from "../components/Chat/ChatList";
import Loading from "../components/Loading";
import { chatRoomsState } from "../state/state";

const Chat = () => {
  const [chatRooms, setChatRooms] = useRecoilState(chatRoomsState);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(() => {
    socket.emit("get_rooms", (data: any) => {
      setChatRooms(data);
    });
  }, [setChatRooms]);

  useEffect(() => {
    socket.on("receive_message", () => {
      console.log("리시이이잉이잉이브 받앗다");
      fetchData();
    });
    socket.emit("notification");
    fetchData();
    setIsLoading(false);
  }, [fetchData]);

  return isLoading ? <Loading /> : <ChatList chatRooms={chatRooms} />;
};

export default Chat;
