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
  key: "content",
  default: "",
});

export const imageStorage = atom({
  key: "image",
  default: {},
});

export const searchLocation = atom({
  key: "location",
  default: "",
});

export const mapResultsStorage = atom({
  key: "mapSearchResults",
  default: [],
});

export const currentLocationStorage = atom({
  key: "currentLocation",
  default: {},
});

export const headerState = atom({
  key: "header",
  default: false,
});
