import { BrowserRouter, Route, Routes } from "react-router-dom";
import Upload from "../pages/Book";
import Chat from "../pages/Chat";
import Main from "../pages/Main";
import Search from "../pages/Search";
import ChatRoom from "./Chat/ChatRoom";
import Header from "./Header/Header";
import Mypage from "./Header/Mypage";
import Signin from "./Header/Signin";
import Signup from "./Header/Signup";

const Routers = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<ChatRoom />} />
        <Route path="/myinfo" element={<Mypage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
