export type UserState = {
  id: number;
  nickname: string;
  img: string;
  admin: boolean;
  email: string;
  password?: string;
  locationId: number;
  createdAt: string;
  updatedAt: string;
  locations: locations;
};

export type UserInfo = {
  userInfo: {
    id: number;
    nickname: string;
    admin: boolean;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type BookInfo = {
  id: number;
  title: string;
  img: string;
  content: string;
  quality: string;
  exchanged: Boolean;
  userId: number;
  userNickname: string;
  createdAt: string;
  updatedAt: string;
  locations: locations;
};

export type KakaoMap = {
  panTo(arg: any): any;
  setCenter(arg: any): any;
};

export type ListProps = {
  id: number;
  title: string;
  img: string;
  content: string;
  quality: string;
  exchanged: Boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  locations: locations;
};

export type ErrorProps = {
  error: string | undefined;
};

type locations = {
  id: number;
  lat: number;
  lon: number;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type isWriterProps = {
  isWriter: Boolean;
};
