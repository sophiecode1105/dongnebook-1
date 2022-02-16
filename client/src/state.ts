import { atom } from "recoil";

type UserState = {
  id?: number;
  nickname?: string;
  img?: string;
  admin?: boolean;
  email?: string;
  locationId?: number;
  createdAt?: string;
  updatedAt?: string;
  locations?: {
    createdAt: string;
    address: string;
    id: number;
    lat: number;
    lon: number;
    updatedAt: string;
  };
};

export const userState = atom<UserState>({
  key: "user",
  default: {},
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
