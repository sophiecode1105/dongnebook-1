import { useSetRecoilState } from "recoil";
import { enterChatRoom, timeForToday } from "../../api";
import { chatRoomFrame, chatRoomVisible } from "../../state/state";
import { ChatListComponentProps } from "../../state/typeDefs";

const ChatList = ({ chatRooms }: ChatListComponentProps) => {
  const setVisible = useSetRecoilState(chatRoomVisible);
  const setChatroomFrame = useSetRecoilState(chatRoomFrame);

  return (
    <div className="h-[90vh] pt-20 max-w-md w-full m-auto p-2">
      <h1 className="text-3xl font-bold pb-3 border-b-2 border-[#7F7F7F] mb-3">채팅목록</h1>
      <ul className="h-full overflow-y-scroll">
        {chatRooms?.map((chatRoom, idx) => {
          const { count, id } = chatRoom;
          const { img, nickname } = chatRoom.users[0].users;
          const { content, createdAt } = chatRoom.chats[0];

          return (
            <li
              key={idx}
              onClick={async () => {
                const data = await enterChatRoom(id);
                console.log(data);
                setVisible(true);
              }}
              className="flex text-gray-600 bg-slate-50 h-20 cursor-pointer">
              <div className="rounded-full flex items-center justify-center p-1">
                <img src={img} className="rounded-full w-12 h-12" />
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
        })}
      </ul>
    </div>
  );
};

export default ChatList;
