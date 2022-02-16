import { atom } from "recoil";

export const userState = atom({
  key: "user",
  default: {},
});

export const loginState = atom({
  key: "login",
  default: localStorage.getItem("token"),
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
