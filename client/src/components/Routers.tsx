import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "../pages/Main";
import Header from "./Header/Header";

const Routers = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Main />} />
    </Routes>
  </BrowserRouter>
);

export default Routers;
