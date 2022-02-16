export interface UserState {
  id: number;
  nickname: string;
  img: string;
  admin: boolean;
  email: string;
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
}

export type BookInfo = {
  id: number;
  title: string;
  img: string;
  content: string;
  quality: string;
  exchanged: Boolean;
  userId: number;
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
  img: string;
  content: string;
  quality: string;
  exchanged: Boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  locations: {
    address: string;
  };
};
