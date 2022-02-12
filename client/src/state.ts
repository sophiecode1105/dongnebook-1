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

export const titleStorage = atom({
  key: "title",
  default: "",
});

export const contentStorage = atom({
  key: "title",
  default: "",
});

export const imageStorage = atom({
  key: "title",
  default: {},
});
