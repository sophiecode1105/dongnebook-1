import { atom } from "recoil";

export const loginState = atom({
  key: "isLogin",
  default: localStorage.getItem("isLogin") ? true : false,
});
