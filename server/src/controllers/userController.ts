import express from "express";
import client from "../client";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userFinder, verify } from "../token/verify";

export const postCertify = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "이메일을 입력해주세요.", state: false });
    }
    const existUser = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (!existUser) {
      let number = Math.floor(Math.random() * 1000000) + 100000; // ★★난수 발생 ★★★★★
      if (number > 1000000) {
        number = number - 100000;
      }

      let transporter = nodemailer.createTransport({
        service: "naver", //사용하고자 하는 서비스
        port: 587,
        host: "smtp.naver.com",
        secure: false,
        requireTLS: true,
        auth: {
          user: "malove0330@naver.com", //gmail주소입력
          pass: process.env.MAIL_PASSWORD, //gmail패스워드 입력
        },
      });
      await transporter.sendMail({
        from: "malove0330@naver.com", //보내는 주소 입력
        to: `${email}`, //위에서 선언해준 받는사람 이메일
        subject: "안녕하세요", //메일 제목
        html: `<div
        style='
        text-align: center;
        width: 50%;
        height: 60%;
        margin: 15%;
        padding: 20px;
        box-shadow: 1px 1px 3px 0px #999;
        '>
        인증번호는 ${number} 입니다.
        <br/><br/><br/><br/></div>`,
      });
      return res.status(200).json({ message: "인증 성공", number, state: true }); // 클라이언트에게 보내기
    } else {
      return res.status(200).json({ message: "이미 가입된 회원입니다.", state: false });
    }
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const nickCheck = async (req: express.Request, res: express.Response) => {
  try {
    const { nickname } = req.body;

    const existUser = await client.user.findUnique({
      where: {
        nickname,
      },
    });

    if (!existUser) {
      return res.status(200).json({ message: "사용 가능한 닉네임 입니다.", state: true });
    } else {
      return res.status(403).json({ message: "이미 사용중인 닉네임 입니다.", state: false });
    }
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const postJoin = async (req: express.Request, res: express.Response) => {
  try {
    const { email, nickname, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 3);

    await client.location.create({
      data: {
        lat: 37.4965544495086,
        lon: 127.02475418053183,
        address: "서울시 서초구 서초동",

        users: {
          create: {
            nickname,
            admin: false,
            password: hashPassword,
            email,
            img: "https://practice0210.s3.ap-northeast-2.amazonaws.com/31644921016560.png",
          },
        },
      },
    });

    const user = await userFinder(email);

    return res.status(201).json({ message: "회원가입 완료", user, state: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    const userInfo = await client.user.findUnique({
      where: {
        email,
      },
      include: {
        likes: true,
        locations: true,
      },
    });

    if (userInfo) {
      const user = await bcrypt.compare(password, userInfo.password);
      if (user) {
        const token = jwt.sign(
          {
            id: userInfo.id,
            email: userInfo.email,
            nickname: userInfo.nickname,
          },
          process.env.ACCESS_SECRET,
          {
            expiresIn: "24h",
          }
        );
        delete userInfo.password;
        return res.status(200).json({ message: "로그인 완료", state: true, userInfo, token });
      } else {
        return res.status(400).json({ message: "비밀번호가 일치하지 않습니다.", state: false });
      }
    } else {
      return res.status(403).json({ message: "존재하지않는 회원입니다.", state: false });
    }
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const deleteJoin = async (req: express.Request, res: express.Response) => {
  try {
    const authorization = req.headers.authorization;

    const tokenInfo = verify(authorization.split(" ")[1]);

    const userInfo = await userFinder(tokenInfo["email"]);

    await client.location.delete({
      where: {
        id: userInfo["locationId"],
      },
    });
    return res.status(200).json({ message: "회원탈퇴 완료", state: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const mypage = async (req: express.Request, res: express.Response) => {
  try {
    const authorization = req.headers.authorization;

    let tokenInfo: string | jwt.JwtPayload;

    try {
      tokenInfo = verify(authorization.split(" ")[1]);
    } catch {
      return res.status(401).json({ message: "로그인을 다시 해주세요.", state: false });
    }

    const userInfo = await client.user.findUnique({
      where: {
        email: tokenInfo["email"],
      },
      include: {
        locations: true,
        likes: true,
      },
    });
    const exchangeTrue = await client.product.findMany({
      where: {
        exchanged: true,
        nickname: userInfo.nickname,
      },
      include: {
        images: true,
      },
    });
    const exchangeFalse = await client.product.findMany({
      where: {
        exchanged: false,
        nickname: userInfo.nickname,
      },
      include: {
        images: true,
      },
    });

    delete userInfo.password;

    return res.status(200).json({
      message: "마이페이지 접근 완료",
      userInfo,
      exchangeTrue,
      exchangeFalse,
      state: true,
    });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const putMypage = async (req: express.Request, res: express.Response) => {
  try {
    const { nickname, lat, lon, address } = req.body;
    const authorization = req.headers.authorization;

    const userInfo = verify(authorization.split(" ")[1]);

    const user = await client.user.update({
      where: {
        email: userInfo["email"],
      },

      data: {
        nickname,
        img: req.files[0] && req.files[0].location,
      },
    });

    await client.location.update({
      where: {
        id: user.locationId,
      },
      data: {
        lat: Number(lat),
        lon: Number(lon),
        address,
      },
    });
    return res.status(200).json({ message: "마이페이지 수정 완료", state: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};
