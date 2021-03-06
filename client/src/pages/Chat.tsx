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
      setIsLoading(false);
    });
  }, [setChatRooms]);

  useEffect(() => {
    socket.on("receive_message", () => {
      fetchData();
    });

    socket.emit("notification");
    fetchData();
  }, [fetchData]);

  return isLoading ? <Loading /> : <ChatList chatRooms={chatRooms} />;
};

export default Chat;
