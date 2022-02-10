import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "../pages/Main";
import Header from "./Header/Header";
import Signup from "./Header/Signup";

const Routers = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </BrowserRouter>
);

export default Routers;
