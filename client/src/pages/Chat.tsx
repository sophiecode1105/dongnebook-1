import { useEffect, useState } from "react";
import { getChatRoomList } from "../api";
import ChatList from "../components/Chat/ChatList";
import Loading from "../components/Loading";
import io from "socket.io-client";
import { URL } from "../api";
export const socket = io(`${URL}`);

const Chat = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const data = await getChatRoomList();
    setChatRooms(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return isLoading ? <Loading /> : <ChatList chatRooms={chatRooms} />;
};

export default Chat;
