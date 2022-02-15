import axios from "axios";

const URL = "http://localhost:4000";

type Nick = { nickname: string };
export const postNickcheck = async (body: Nick) => {
  try {
    const {
      data: { state },
    } = await axios.post(`${URL}/user/nickcheck`, body);
    return state;
  } catch (e) {
    console.error(e);
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
  userInfo: {
    id: number;
    nickname: string;
    email: string;
    img: string;
    admin: boolean;
  };
};

export const postSignin = async (body: LoginInfo): Promise<User> => {
  try {
    const {
      data: { userInfo, token },
    } = await axios.post(`${URL}/user/login`, body);
    delete userInfo.password;
    return { userInfo, token };
  } catch (e) {
    throw e;
  }
};

export const getUserInfo = async (token: string | null) => {
  try {
    if (token) {
      const {
        data: { userInfo },
      } = await axios.get(`${URL}/user/mypage`, {
        headers: { token },
      });
      return userInfo;
    }
    return {};
  } catch (e) {
    throw e;
  }
};

export const getBookList = async () => {
  try {
    const {
      data: { allProductList },
    } = await axios.get(`${URL}/product/list`, { withCredentials: true });
    return allProductList;
  } catch (e) {
    throw e;
  }
};
