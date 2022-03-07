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
  likes: likes[] | any;
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
  images: Images[];
  content: string;
  visit: number;
  quality: string;
  exchanged: boolean | undefined;
  userId: number;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
  locations: locations;
  users: any;
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
  exchanged: boolean | undefined;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  locations: locations;
  images: Images[];
};

export interface Nickprops {
  nickValid?: boolean;
}

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
  createdAt: Date;
  updatedAt: Date;
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

export type chatRooms = {
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
    images: Images[];
  };
  count: number;
};

export type ChatListComponentProps = {
  chatRooms: chatRooms[];
};

export type ChatRoomFrameType = {
  nickname: string;
  userId: number;
  bookImg: string;
  title: string;
  img?: string;
  productId: number;
  chatroomId?: number;
  chats?: Chat[];
};

export type Images = {
  id: number;
  url: string;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Chat = {
  id: number;
  userId: number;
  content: string;
  read: boolean;
  chatroomId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type LikeList = {
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
