import { atom } from "recoil";
import { ChatRoomFrameType, UserState, LikeList, BookInfo, chatRooms } from "./typeDefs";

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

export const currentLocationStorage = atom<any>({
  key: "currentLocation",
  default: {
    addressName: "",
    x: 0,
    y: 0,
  },
});

export const currentLatitude = atom<number>({
  key: "currentLatitude",
  default: 0,
});

export const modifyLatitude = atom<number>({
  key: "modifyLatitude",
  default: 0,
});

export const currentLongtitude = atom<number>({
  key: "currentLongtitude",
  default: 0,
});

export const modifyLongtitude = atom<number>({
  key: "modifyLongtitude",
  default: 0,
});

export const currentaddress = atom<string>({
  key: "address",
  default: "",
});

export const modifyAddress = atom<string>({
  key: "address",
  default: "",
});

export const storeContentId = atom<number | null>({
  key: "id",
  default: null,
});

export const chatlist = atom({
  key: "chatlist",
  default: {},
});

export const bookSearch = atom<string>({
  key: "bookSearch",
  default: "",
});

export const chatRoomVisible = atom<boolean>({
  key: "chatRoomVisible",
  default: false,
});

export const chatRoomFrame = atom<ChatRoomFrameType>({
  key: "chatRoomFrame",
  default: {} as ChatRoomFrameType,
});

export const pressLike = atom<LikeList[]>({
  key: "pressLike",
  default: [],
});

export const unableExchange = atom<BookInfo[]>({
  key: "unableExchange",
  default: [],
});

export const ableExchange = atom<BookInfo[]>({
  key: "ableExchange",
  default: [],
});

export const chatRoomsState = atom<chatRooms[]>({
  key: "chatRoomsState",
  default: [],
});
