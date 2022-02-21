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
  likes: likes[];
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
  nickname: string;
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
  content: string;
  quality: string;
  exchanged: Boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  locations: locations;
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

export type CurrentImgProps = {
  Cm: number;
};

type locations = {
  id: number;
  lat: number;
  lon: number;
  address: string;
  createdAt: string;
  updatedAt: string;
};

type likes = {
  createdAt: string;
  id: number;
  productId: number;
  updatedAt: string;
  userId: number;
};

export type isWriterProps = {
  isWriter: Boolean;
};
