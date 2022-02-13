import { useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginState } from "../../state";

const Header = () => {
  const [click, setClick] = useState(false);
  const [login, setLogin] = useRecoilState(loginState);

  return (
    <div className="fixed top-0 left-0 bg-white header--shadow w-full">
      <header className="flex justify-between max-w-screen-xl m-auto w-full p-2">
        <div>로고</div>
        <nav className="md:flex hidden justify-center items-center">
          <Link
            to="/search"
            className="flex flex-col hover:text-green-600 cursor-pointer transition duration-200">
            <span className="text-sm font-bold text-center">검색</span>
          </Link>
          <Link
            to="/chat"
            className="flex flex-col ml-10 text-center hover:text-green-600 cursor-pointer transition duration-200">
            <span className="text-sm font-bold">채팅</span>
          </Link>
          <Link
            to="/notice"
            className="flex flex-col ml-10 text-center hover:text-green-600 cursor-pointer transition duration-200">
            <span className="text-sm font-bold">공지사항</span>
          </Link>
          {login ? (
            <Link
              to="/myinfo"
              className="flex flex-col ml-10 text-center hover:text-green-600 cursor-pointer transition duration-200">
              <span className="text-sm font-bold">내정보</span>
            </Link>
          ) : (
            <Link
              to="/signup"
              className="flex flex-col ml-10 text-center hover:text-green-600 cursor-pointer transition duration-200">
              <span className="text-sm font-bold">회원가입</span>
            </Link>
          )}
          {login ? (
            <Link
              onClick={() => {
                setLogin((prev) => !prev);
              }}
              to="/"
              className="flex flex-col ml-10 text-center hover:text-green-600 cursor-pointer transition duration-200">
              <span className="text-sm font-bold">로그아웃</span>
            </Link>
          ) : (
            <Link
              to="/signin"
              className="flex flex-col ml-10 text-center hover:text-green-600 cursor-pointer transition duration-200">
              <span className="text-sm font-bold">로그인</span>
            </Link>
          )}
        </nav>
        <i
          onClick={() => setClick((prev) => !prev)}
          className="md:hidden fas fa-bars text-2xl hover:text-green-600 cursor-pointer transition duration-200"></i>
        <nav
          className={`md: justify-center items-centerhidden absolute right-0 top-8 bg-white w-full header--shadow -z-50 p-3 ${
            click ? "sidebar--slide" : "hidden"
          }`}>
          <Link
            onClick={() => setClick((prev) => !prev)}
            to="/search"
            className="flex flex-col hover:text-green-600 text-center cursor-pointer transition duration-200 mb-3">
            <span className="text-sm font-bold">검색</span>
          </Link>
          <Link
            onClick={() => setClick((prev) => !prev)}
            to="/chat"
            className="flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200 mb-3">
            <span className="text-sm font-bold">채팅</span>
          </Link>
          <Link
            onClick={() => setClick((prev) => !prev)}
            to="/notice"
            className="flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200 mb-3">
            <span className="text-sm font-bold">공지사항</span>
          </Link>
          {login ? (
            <Link
              onClick={() => setClick((prev) => !prev)}
              to="/myinfo"
              className="flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200 mb-3">
              <i className="fas fa-user text-2xl"></i>
              <span className="text-sm font-bold">내정보</span>
            </Link>
          ) : (
            <Link
              onClick={() => setClick((prev) => !prev)}
              to="/signup"
              className="flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200 mb-3">
              <span className="text-sm font-bold">회원가입</span>
            </Link>
          )}
          {login ? (
            <Link
              onClick={() => {
                setLogin((prev) => !prev);
              }}
              to="/"
              className="flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200">
              <span className="text-sm font-bold">로그아웃</span>
            </Link>
          ) : (
            <Link
              onClick={() => setClick((prev) => !prev)}
              to="/signin"
              className="flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200">
              <span className="text-sm font-bold">로그인</span>
            </Link>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Header;
