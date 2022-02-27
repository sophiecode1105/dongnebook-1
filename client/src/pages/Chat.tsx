import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { socket } from "../api";
import ChatList from "../components/Chat/ChatList";
import Loading from "../components/Loading";
import { fetchRoom } from "../state/state";

const Chat = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetch = useRecoilValue(fetchRoom);

  const fetchData = () => {
    socket.emit("get_rooms", (data: any) => {
      setChatRooms(data);
    });
  };

  useEffect(() => {
    socket.emit("notification", () => {
      fetchData();
    });

    socket.on("receive_message", () => {
      console.log("리시이이잉이잉이브 받앗다");
      fetchData();
    });
    setIsLoading(false);
  }, [fetch]);

  return isLoading ? <Loading /> : <ChatList chatRooms={chatRooms} />;
};

export default Chat;
