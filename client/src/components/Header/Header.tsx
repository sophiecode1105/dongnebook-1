import { useState } from "react";

const Header = () => {
  const [click, setClick] = useState(false);
  return (
    <div className='fixed top-0 left-0 bg-white header--shadow w-full'>
      <header className='flex justify-between max-w-screen-xl m-auto w-full p-2'>
        <div>로고</div>
        <nav className='md:flex hidden'>
          <div className='flex flex-col hover:text-green-600 cursor-pointer transition duration-200'>
            <i className='fas fa-book-open text-2xl'></i>
            <span className='text-xs text-center'>검색</span>
          </div>
          <div className='flex flex-col ml-5 text-center hover:text-green-600 cursor-pointer transition duration-200'>
            <i className='fas fa-comment text-2xl'></i>
            <span className='text-xs'>채팅</span>
          </div>
          <div className='flex flex-col ml-5 text-center hover:text-green-600 cursor-pointer transition duration-200'>
            <i className='fas fa-clipboard-list text-2xl'></i>
            <span className='text-xs'>공지사항</span>
          </div>
          <div className='flex flex-col ml-5 text-center hover:text-green-600 cursor-pointer transition duration-200'>
            <i className='fas fa-user-plus text-2xl'></i>
            <span className='text-xs'>회원가입</span>
          </div>
          <div className='flex flex-col ml-5 text-center hover:text-green-600 cursor-pointer transition duration-200'>
            <i className='fas fa-sign-in-alt text-2xl'></i>
            <span className='text-xs'>로그인</span>
          </div>
        </nav>
        <i
          onClick={() => setClick((prev) => !prev)}
          className='md:hidden fas fa-bars text-2xl hover:text-green-600 cursor-pointer transition duration-200'></i>
        <nav
          className={`md:hidden absolute right-0 top-8 bg-white w-full header--shadow -z-50 ${
            click ? "sidebar--slide" : "hidden"
          }`}>
          <div className='flex flex-col hover:text-green-600 text-center cursor-pointer transition duration-200 mb-3'>
            <i className='fas fa-book-open text-2xl'></i>
            <span className='text-xs'>검색</span>
          </div>
          <div className='flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200 mb-3'>
            <i className='fas fa-comment text-2xl'></i>
            <span className='text-xs'>채팅</span>
          </div>
          <div className='flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200 mb-3'>
            <i className='fas fa-clipboard-list text-2xl'></i>
            <span className='text-xs'>공지사항</span>
          </div>
          <div className='flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200 mb-3'>
            <i className='fas fa-user-plus text-2xl'></i>
            <span className='text-xs'>회원가입</span>
          </div>
          <div className='flex flex-col text-center hover:text-green-600 cursor-pointer transition duration-200 mb-3'>
            <i className='fas fa-sign-in-alt text-2xl'></i>
            <span className='text-xs'>로그인</span>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
