import { useQuery } from "react-query";
import { getChatRoomList } from "../api";
import ChatList from "../components/Chat/ChatList";
import Loading from "../components/Loading";

const Chat = () => {
  const { isLoading, data: chatRooms } = useQuery("allChatRooms", getChatRoomList);
  return isLoading ? <Loading /> : <ChatList chatRooms={chatRooms} />;
};

export default Chat;
