import axios from "axios";
import { BookInfo, UserState } from "./state/typeDefs";
import socketIOClient from "socket.io-client";

const URL = "http://localhost:4000";
export const socket = socketIOClient(`${URL}`);

type Nick = { nickname: string };
export const postNickcheck = async (body: Nick) => {
  try {
    const {
      data: { state },
    } = await axios.post(`${URL}/user/nickcheck`, body);
    return state;
  } catch (e) {
    throw e;
  }
};

type EmailCheckRequest = { email: string };
type EmailCheckResponse = {
  number: string | undefined;
};
export const postEmailcheck = async (body: EmailCheckRequest): Promise<string | undefined> => {
  try {
    const {
      data: { number },
    } = await axios.post<EmailCheckResponse>(`${URL}/user/certify`, body);
    if (number !== undefined) {
      return String(number);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};

interface Userinfo {
  email: string;
  password: string;
  nickname?: string;
}

export const postSignup = async (body: Userinfo) => {
  try {
    await axios.post(`${URL}/user/join`, body);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

interface LoginInfo extends Userinfo {
  keep: boolean;
}

type User = {
  token: string;
  userInfo: UserState;
};

export const postSignin = async (body: LoginInfo): Promise<User> => {
  try {
    const {
      data: { userInfo, token },
    } = await axios.post<User>(`${URL}/user/login`, body);
    delete userInfo.password;
    return { userInfo, token };
  } catch (e) {
    throw e;
  }
};

export const getUserInfo = async (token: string | null): Promise<UserState> => {
  try {
    if (token) {
      const {
        data: { userInfo },
      } = await axios.get<User>(`${URL}/user/mypage`, {
        headers: { Authorization: `jwt ${token}` },
      });
      return userInfo;
    }
    return {} as UserState;
  } catch (e: any) {
    throw e;
  }
};

export const postContent = async (body: any, token: string) => {
  try {
    let resp = await axios.post(`${URL}/product/post`, body, {
      headers: { Authorization: `jwt ${token}` },
    });
    return resp.status;
  } catch (e) {
    throw e;
  }
};

export const patchExchange = async (id: number) => {
  try {
    let resp = await axios.patch(`${URL}/product/${id}/exchange`);
    return resp.status;
  } catch (e) {
    throw e;
  }
};

export const patchAccount = async (body: any, token: string) => {
  try {
    const {
      data: { state },
    } = await axios.patch(`${URL}/user/mypage`, body, { headers: { Authorization: `jwt ${token}` } });
    return state;
  } catch (e) {
    throw e;
  }
};

export const deleteContent = async (id: number | undefined) => {
  try {
    await axios.delete(`${URL}/product/${id}`);
  } catch (e) {
    throw e;
  }
};

export const getBookList = async () => {
  try {
    const {
      data: { allProductList },
    } = await axios.get(`${URL}/product/list?page=1`, { withCredentials: true });
    return allProductList;
  } catch (e) {
    throw e;
  }
};

export const getSingleBookInfo = async (
  id: number | undefined,
  token: string | null
): Promise<BookInfo> => {
  try {
    const {
      data,
      data: { productInfo },
    } = await axios.get(`${URL}/product/${id}`, {
      headers: token
        ? { Authorization: `jwt ${token}`, withCredentials: true }
        : { withCredentials: true },
    });
    return productInfo;
  } catch (e) {
    throw e;
  }
};

export const searchBook = async (type: string, value: string) => {
  try {
    const {
      data: { result },
    } = await axios.get(`${URL}/product/search?type=${type}&value=${value}`);
    return result;
  } catch (e) {
    throw e;
  }
};

export const postHeart = async (id: number | undefined, token: string | null) => {
  try {
    await axios.post(
      `${URL}/product/${id?.toString()}`,
      {},
      { headers: { Authorization: `jwt ${token}` } }
    );
  } catch (e) {
    throw e;
  }
};

export const patchContent = async (id: number, body: any, token: string | null) => {
  try {
    let resp = await axios.patch(`${URL}/product/${id}`, body, {
      headers: { Authorization: `jwt ${token}` },
    });
    return resp.status;
  } catch (e) {
    throw e;
  }
};

export const getMemberInfo = async (token: string | null) => {
  try {
    const {
      data: { userInfo },
    } = await axios.get(`${URL}/user/mypage`, { headers: { Authorization: `jwt ${token}` } });
    return userInfo;
  } catch (e) {
    throw e;
  }
};

export const deleteAccount = async (token: string | null) => {
  try {
    await axios.delete(`${URL}/user/delete`, { headers: { Authorization: `jwt ${token}` } });
  } catch (e) {
    throw e;
  }
};

export const timeForToday = (value: Date) => {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
  if (betweenTime < 1) return "방금전";
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  return `${betweenTimeDay}일전`;
};

export const getChatRoomList = () => {
  const token = localStorage.getItem("token");
  return fetch(`${URL}/chatroom`, { headers: { Authorization: `jwt ${token}` } })
    .then((res) => res.json())
    .then((json) => json.chatroom);
};

export const enterChatRoom = (id: number) => {
  const token = localStorage.getItem("token");
  return fetch(`${URL}/chatroom/${id}`, { headers: { Authorization: `jwt ${token}` } })
    .then((res) => res.json())
    .then((json) => json.chatroom[0]);
};

export const sendMessage = (content: string, productId: number) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${URL}/chatroom`,
    { content, productId },
    { headers: { Authorization: `jwt ${token}` } }
  );
};

export const timeStamp = (value: Date) => {
  const date = new Date(value);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

export const getLocationList = async (token: string | null) => {
  const {
    data: { userLocation, productLocation },
  } = await axios.get(`${URL}/location`, { headers: { Authorization: `jwt ${token}` } });

  return { userLocation, productLocation };
};
