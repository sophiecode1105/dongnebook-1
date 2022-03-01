import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import { chatRoomVisible, loginState } from "../../state/state";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getUserInfo } from "../../api";
import { userState } from "../../state/state";
import { UserState } from "../../state/typeDefs";
import ChatRoom from "../Chat/ChatRoom";

const Header = () => {
  const [click, setClick] = useState(false);
  const [login, setLogin] = useRecoilState(loginState);
  const setUser = useSetRecoilState(userState);
  const visible = useRecoilValue(chatRoomVisible);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      setUser(await getUserInfo(token));
    } catch {
      localStorage.removeItem("token");
      setLogin(null);
    }
  }, [setLogin, setUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {visible && <ChatRoom />}
      <div className="fixed top-0 left-0 bg-white header--shadow w-full z-50">
        <header className="flex justify-between max-w-screen-xl m-auto w-full p-2">
          <div>
            <Link to="/">
              <img src={logo} alt="logo" className="h-10" />
            </Link>
          </div>

          <nav className="md:flex hidden justify-center items-center">
            <Link
              to="/around"
              className="flex flex-col hover:text-green-600 cursor-pointer transition duration-200"
            >
              <span className="text-sm font-bold text-center">주변 도서 검색</span>
            </Link>
            <Link
              to="/search"
              className="flex flex-col hover:text-green-600 cursor-pointer transition duration-200 ml-10"
            >
              <span className="text-sm font-bold text-center">도서 검색</span>
            </Link>
            {login ? (
              <Link
                to="/chat"
                className="flex flex-col ml-10 text-center hover:text-green-600 cursor-pointer transition duration-200"
              >
                <span className="text-sm font-bold">채팅</span>
              </Link>
            ) : null}
            <Link
              to={login ? "/mypage" : "/signup"}
              className="flex flex-col ml-10 text-center hover:text-green-600 cursor-pointer transition duration-200"
            >
              <span className="text-sm font-bold">{login ? "내정보" : "회원가입"}</span>
            </Link>
            <Link
              to={login ? "/" : "/signin"}
              onClick={() => {
                if (login) {
                  localStorage.removeItem("token");
                  setLogin(null);
                  window.location.href = "/";
                }
              }}
              className="flex flex-col ml-10 text-center hover:text-green-600 cursor-pointer transition duration-200"
            >
              <span className="text-sm font-bold">{login ? "로그아웃" : "로그인"}</span>
            </Link>
          </nav>
          <i
            onClick={() => setClick((prev) => !prev)}
            className="md:hidden fas fa-bars text-2xl hover:text-green-600 cursor-pointer transition duration-200"
          ></i>
          <nav
            className={`md: justify-center items-centerhidden absolute md:hidden right-0 top-14 bg-white w-full header--shadow -z-50 p-3 ${
              click ? "sidebar--slide" : "hidden"
            }`}
          >
            <Link
              to="/around"
              onClick={() => setClick((prev) => !prev)}
              className="flex flex-col hover:text-green-600 text-center cursor-pointer transition duration-200 mb-3"
            >
              <span className="text-sm font-bold ">주변 도서 검색</span>
            </Link>
            <Link
              onClick={() => setClick((prev) => !prev)}
              to="/search"
              className="flex flex-col hover:text-green-600 text-center cursor-pointer transition duration-200 mb-3"
            >
              <span className="text-sm font-bold">도서 검색</span>
            </Link>
            {login ? (
              <Link
                onClick={() => setClick((prev) => !prev)}
                to="/chat"
                className="flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200 mb-3"
              >
                <span className="text-sm font-bold">채팅</span>
              </Link>
            ) : null}
            <Link
              onClick={() => setClick((prev) => !prev)}
              to={login ? "/mypage" : "/signup"}
              className="flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200 mb-3"
            >
              <span className="text-sm font-bold">{login ? "내정보" : "회원가입"}</span>
            </Link>
            <Link
              to={login ? "/" : "/signin"}
              onClick={() => {
                if (login) {
                  localStorage.removeItem("token");
                  setLogin(null);
                  setUser({} as UserState);

                  window.location.href = "/";
                }
                setClick((prev) => !prev);
              }}
              className="flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200"
            >
              <span className="text-sm font-bold">{login ? "로그아웃" : "로그인"}</span>
            </Link>
          </nav>
        </header>
      </div>
    </>
  );
};

export default Header;
