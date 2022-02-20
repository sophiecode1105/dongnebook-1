import { useRecoilValue } from "recoil";
import { timeForToday } from "../../api";
import { chatRoomList } from "../../state/state";

const ChatList = () => {
  const chatRooms = useRecoilValue(chatRoomList);

  return (
    <ul className="pt-16 max-w-md w-full m-auto p-2">
      {chatRooms?.map((chatRoom, idx) => {
        const { count } = chatRoom;
        const { img, nickname } = chatRoom.users[0].users;
        const { content, createdAt } = chatRoom.chats[0];

        return (
          <li key={idx} className="flex text-gray-600 bg-slate-50 p-3">
            <div className="w-12 h-12 rounded-2xl flex justify-center items-center mr-3">
              <img src={img} className="w-full h-full rounded-full" />
            </div>
            <div className="w-full border-b border-gray-200 p-2">
              <div className="flex justify-between">
                <h1 className="text-lg font-bold ">{nickname}</h1>
                <span className="text-sm">{timeForToday(createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <p className="text-xs font-semibold">{content}</p>
                <span className="w-5 h-5 rounded-full bg-red-400 flex justify-center items-center text-gray-50">
                  {count}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ChatList;
