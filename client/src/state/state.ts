import { atom } from "recoil";
import { UserInfo, UserState } from "./typeDefs";

export const userState = atom<UserState>({
  key: "user",
  default: {} as UserState,
});

export const loginState = atom<string | null>({
  key: "login",
  default: localStorage.getItem("token"),
});

export const titleStorage = atom<string>({
  key: "title",
  default: "",
});

export const contentStorage = atom<string>({
  key: "content",
  default: "",
});

export const imageStorage = atom({
  key: "image",
  default: {},
});

export const searchLocation = atom<string>({
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

export const currentLatitude = atom<number>({
  key: "currentLatitude",
  default: 0,
});

export const currentLongtitude = atom<number>({
  key: "currentLongtitude",
  default: 0,
});

export const currentaddress = atom<string>({
  key: "address",
  default: "",
});

export const chatlist = atom({
  key: "chatlist",
  default: {},
});

export const bookSearch = atom<string>({
  key: "bookSearch",
  default: "",
});
