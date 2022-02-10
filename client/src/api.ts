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

type EmailCheck = { email: string };
export const postEmailcheck = async (body: EmailCheck) => {
  try {
    const {
      data: { number },
    } = await axios.post(`${URL}/user/certify`, body);
    return number;
  } catch (e) {
    console.error(e);
  }
};

type Userinfo = { email: string; password: string; nickname?: string };

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

type A = { id: number | undefined; admin: boolean | undefined };
export const postSignin = async (body: Userinfo): Promise<A> => {
  try {
    const {
      data: {
        createUser: { id, admin },
      },
    } = await axios.post(`${URL}/user/login`, body);
    return { id, admin };
  } catch (e) {
    throw e;
  }
};
