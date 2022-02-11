import { atom } from "recoil";

export const loginState = atom({
  key: "isLogin",
  default: Boolean(localStorage.getItem("isLogin")),
});

export const userId = atom({
  key: "userId",
  default: "",
});

export const adminState = atom({
  key: "admin",
  default: false,
});
