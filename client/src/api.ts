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
    const {
      data: {
        createUser: { id },
      },
    } = await axios.post(`${URL}/user/join`, body);
    return id;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

interface LoginInfo extends Userinfo {
  keep: boolean;
}

type A = { id: number | undefined; admin: boolean | undefined };
export const postSignin = async (body: LoginInfo): Promise<A> => {
  try {
    const {
      data: {
        userInfo: { id, admin },
      },
    } = await axios.post(`${URL}/user/login`, body);
    return { id, admin };
  } catch (e) {
    throw e;
  }
};
