import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { getChatRoomList } from "../api";
import ChatList from "../components/Chat/ChatList";
import { loginState } from "../state/state";

const Chat = () => {
  const token: string | null = useRecoilValue(loginState);

  const fetchData = () => {
    getChatRoomList(token);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <ChatList />;
};

export default Chat;
