import { BrowserRouter, Route, Routes } from "react-router-dom";
import Upload from "../pages/Book";
import Chat from "../pages/Chat";
import { KakaoTest } from "../pages/KakoTest";
import Main from "../pages/Main";
import Search from "../pages/Search";
import ChatRoom from "./Chat/ChatRoom";
import Detail from "./Detail/Detail";
import Modify from "./Detail/Modify";
import Header from "./Header/Header";
import Mypage from "../pages/Mypage";
import Signin from "./Header/Signin";
import Signup from "./Header/Signup";
import Account from "./Mypage/Account";

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
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/modify" element={<Modify />} />
        <Route path="/search/:id" element={<Detail />} />
        <Route path="/account" element={<Account />} />
        <Route path="/kakao" element={<KakaoTest />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
