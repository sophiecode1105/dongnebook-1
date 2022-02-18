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
  locations: {
    createdAt: string;
    address: string;
    id: number;
    lat: number;
    lon: number;
    updatedAt: string;
  };
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
  images: {
    id: number;
    url: string;
    productId: number;
    createdAt: string;
    updatedAt: string;
  }[];
  content: string;
  visit: number;
  quality: string;
  exchanged: Boolean;
  userId: number;
  userNickname: string;
  createdAt: string;
  updatedAt: string;
  locations: {
    id: number;
    lat: number;
    lon: number;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type KakaoMap = {
  panTo(arg: any): any;
  setCenter(arg: any): any;
};

export type ListProps = {
  id: number;
  title: string;
  content: string;
  quality: string;
  exchanged: Boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  locations: {
    address: string;
  };
  images: {
    id: number;
    url: string;
    productId: number;
    createdAt: string;
    updatedAt: string;
  }[];
};

export type ErrorProps = {
  error: string | undefined;
};

export type isWriterProps = {
  isWriter: Boolean;
};
