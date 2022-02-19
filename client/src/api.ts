import axios from "axios";
import { UserState } from "./state/typeDefs";

const URL = "http://localhost:4000";

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
      } = await axios.get<User>(`${URL}/user/mypage`, { headers: { Authorization: `jwt ${token}` } });
      return userInfo;
    }
    return {} as UserState;
  } catch (e: any) {
    throw e;
  }
};

export const postContent = async (body: any, token: string) => {
  try {
    await axios.post(`${URL}/product/post`, body, { headers: { Authorization: `jwt ${token}` } });
  } catch (e) {
    throw e;
  }
};

export const patchExchange = async (id: number) => {
  try {
    await axios.patch(`${URL}/product/${id}/exchange`);
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

export const getSingleBookInfo = async (id: number | undefined, token: string | null) => {
  try {
    const {
      data: { productInfo },
    } = await axios.get(`${URL}/product/${id}`, {
      headers: token ? { Authorization: `jwt ${token}`, withCredentials: true } : { withCredentials: true },
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
    await axios.post(`${URL}/product/${id?.toString()}`, {}, { headers: { Authorization: `jwt ${token}` } });
  } catch (e) {
    throw e;
  }
};

export const timeForToday = (value: string) => {
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
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년전`;
};

export const getChatRoomList = async (token: string | null) => {
  const {
    data: { chatroom },
  } = await axios.get(`${URL}/chatroom`, { headers: { Authorization: `jwt ${token}` } });
  return chatroom;
};
