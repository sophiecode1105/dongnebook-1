import { useSetRecoilState } from "recoil";
import { timeForToday, socket } from "../../api";
import { chatRoomFrame, chatRoomVisible } from "../../state/state";
import { ChatListComponentProps, ChatRoomFrameType, chatRooms } from "../../state/typeDefs";
import EmtyChatRoom from "./EmtyChatRoom";

const ChatList = ({ chatRooms }: ChatListComponentProps) => {
  const setVisible = useSetRecoilState(chatRoomVisible);
  const setChatroomFrame = useSetRecoilState(chatRoomFrame);

  const fetchData = (id: number) => {
    socket.emit("enter_room", id, (data: any, chat: chatRooms) => {
      setChatroomFrame({
        nickname: chat.users[0].users.nickname,
        userId: chat.users[0].users.id,
        bookImg: chat.product.images[0].url,
        title: chat.product.title,
        productId: chat.productId,
        img: chat.users[0].users.img,
        chatroomId: chat.id,
        chats: chat.chats,
      } as ChatRoomFrameType);
      setVisible(true);
    });
  };

  return (
    <div className="h-[90vh] pt-20 max-w-md w-full m-auto p-2">
      <h1 className="text-2xl font-bold pb-3 border-b-2 border-[#7F7F7F] mb-3">채팅목록</h1>
      <ul className="h-full overflow-y-scroll">
        {chatRooms.length !== 0 ? (
          chatRooms?.map((chatRoom, idx) => {
            const { count, productId } = chatRoom;
            const { img, nickname } = chatRoom.users[0].users;
            const { content, createdAt } = chatRoom.chats[0];

            return (
              <li
                key={idx}
                onClick={() => fetchData(productId)}
                className="flex text-gray-600 bg-slate-50 h-20 cursor-pointer">
                <div className="rounded-full flex items-center justify-center p-1">
                  <img src={img} alt={nickname} className="rounded-full w-12 h-12" />
                </div>
                <div className="w-full p-2 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <h1 className="text-lg font-bold ">{nickname}</h1>
                    <span className="text-sm">{timeForToday(createdAt)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <p className="text-xs font-semibold">{content}</p>
                    {count > 0 && (
                      <span className="w-5 h-5 rounded-full bg-red-400 flex justify-center items-center text-gray-50">
                        {count}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <EmtyChatRoom />
        )}
      </ul>
    </div>
  );
};

export default ChatList;
