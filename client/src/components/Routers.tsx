import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "../pages/Main";
import Upload from "./Book/Upload";
import Header from "./Header/Header";
import Signin from "./Header/Signin";
import Signup from "./Header/Signup";

const Routers = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/upload" element={<Upload />} />
    </Routes>
  </BrowserRouter>
);

export default Routers;
