import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { sendMessage } from "../../api";
import { chatRoomFrame, chatRoomVisible } from "../../state/state";

const ChatRoom = () => {
  const setVisible = useSetRecoilState(chatRoomVisible);
  const frame = useRecoilValue(chatRoomFrame);
  const [message, setMessage] = useState<string>("");
  console.log(frame);

  const submitMessage = async (e: any) => {
    e.preventDefault();
    await sendMessage(message, frame.productId);
    setMessage("");
  };

  return (
    <div className="fixed left-0 top-0 z-[51] w-full h-screen bg-opacity-20 bg-black flex justify-center items-center">
      <div onClick={() => setVisible(false)} className="w-screen h-screen"></div>
      <div className="max-w-md w-full h-screen md:h-[80vh] bg-white z-[52] absolute flex flex-col justify-between">
        <div className="p-3 chatroom--shadow">
          <div className="flex justify-between mb-3 text-xl">
            <i onClick={() => setVisible(false)} className="fas fa-arrow-left cursor-pointer "></i>
            <h1 className="font-bold">{frame.nickname}</h1>
            <i className="fas fa-sign-out-alt cursor-pointer"></i>
          </div>
          <div className="flex">
            <img src={frame.bookImg} alt={frame.title} className="w-28 h-32 mr-3" />
            <h2 className="flex items-center">{frame.title}</h2>
          </div>
        </div>
        <ul className="h-full overflow-y-scroll p-3"></ul>
        <form className="bg-slate-100 w-full h-20 flex justify-center items-center px-2" onSubmit={submitMessage}>
          <input
            type="text"
            className="rounded-full w-4/5 h-3/4 p-2 placeholder:text-xs mr-2"
            placeholder="메시지를 입력하세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="bg-green-100 font-bold w-20 h-3/4 rounded-2xl">
            전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
