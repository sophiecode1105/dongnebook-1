import { useEffect, useState } from "react";
import { socket } from "../api";
import ChatList from "../components/Chat/ChatList";
import Loading from "../components/Loading";

const Chat = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = () => {
    socket.emit("get_rooms", (data: any) => {
      setChatRooms(data);
    });
  };

  useEffect(() => {
    socket.emit("notification", "notification");
    fetchData();

    socket.on("receive_message", (data) => {
      console.log("리시이이잉이잉이브 받앗다");
      fetchData();
    });
  }, []);

  useEffect(() => {
    fetchData();
    setIsLoading(false);
  }, []);

  return isLoading ? <Loading /> : <ChatList chatRooms={chatRooms} />;
};

export default Chat;
