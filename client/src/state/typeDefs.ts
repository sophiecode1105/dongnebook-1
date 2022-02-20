export type UserState = {
  id: number;
  nickname: string;
  img: string;
  admin: boolean;
  email: string;
  password?: string;
  locationId: number;
  createdAt: Date;
  updatedAt: Date;
  locations: locations;
};

export type UserInfo = {
  userInfo: {
    id: number;
    nickname: string;
    admin: boolean;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export type BookInfo = {
  id: number;
  title: string;
  images: {
    id: number;
    url: string;
    productId: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
  content: string;
  visit: number;
  quality: string;
  exchanged: Boolean;
  userId: number;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
  locations: locations;
  images: {
    id: number;
    url: string;
    productId: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export type ErrorProps = {
  error: string | undefined;
};

type locations = {
  id: number;
  lat: number;
  lon: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
};

export type isWriterProps = {
  isWriter: Boolean;
};

export type chatRoomListType = {
  id: number;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
  users: {
    id: number;
    chatroomId: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    users: UserState;
  }[];
  chats: {
    id: number;
    userId: number;
    content: string;
    read: boolean;
    chatroomId: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
  product: {
    id: number;
    title: string;
    content: string;
    quality: string;
    exchanged: boolean;
    nickname: string;
    locationId: number;
    visit: number;
    createdAt: Date;
    updatedAt: Date;
  };
  count: number;
};
