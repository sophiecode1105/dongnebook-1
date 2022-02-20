import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getChatRoomList } from "../api";
import ChatList from "../components/Chat/ChatList";
import { chatRoomList, loginState, userState } from "../state/state";

const Chat = () => {
  const token: string | null = useRecoilValue(loginState);
  const setChatRoomList = useSetRecoilState(chatRoomList);

  const fetchData = async () => {
    setChatRoomList(await getChatRoomList(token));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <ChatList />;
};

export default Chat;
