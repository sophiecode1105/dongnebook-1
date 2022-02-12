import express from "express";
import client from "../client";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
  } catch {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
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
      return res.status(200).json({ message: "이미 사용중인 닉네임 입니다.", state: false });
    }
  } catch {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};

export const postJoin = async (req: express.Request, res: express.Response) => {
  try {
    const { email, nickname, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 3);

    const createUser = await client.user.create({
      data: {
        nickname,
        admin: false,
        password: hashPassword,
        email,
      },
    });
    return res.status(201).json({ message: "회원가입 완료", createUser, state: true });
  } catch {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    const userInfo = await client.user.findUnique({
      where: {
        email,
      },
    });

    if (userInfo) {
      const user = await bcrypt.compare(password, userInfo.password);
      if (user) {
        const token = jwt.sign(
          {
            email: userInfo.email,
            nickname: userInfo.nickname,
          },
          process.env.ACCESS_SECRET,
          {
            expiresIn: "5h",
          }
        );
        delete userInfo.password;
        return res.status(200).json({ message: "로그인 완료", state: true, userInfo, token });
      } else {
        return res.status(403).json({ message: "비밀번호가 일치하지 않습니다.", state: false });
      }
    } else {
      return res.status(403).json({ message: "존재하지않는 회원입니다.", state: false });
    }
  } catch {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};

export const deleteJoin = async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.body;

    jwt.verify(
      token,
      process.env.ACCESS_SECRET,
      async (err: jwt.JsonWebTokenError, decoded: string | jwt.JwtPayload) => {
        try {
          if (err) {
            return res.status(500).json({ message: "로그인을 다시 해주세요." });
          } else {
            const deleteProduct = client.product.deleteMany({
              where: {
                userNickname: decoded["nickname"],
              },
            });
            const deleteUser = client.user.delete({
              where: {
                email: decoded["email"],
              },
            });
            await client.$transaction([deleteProduct, deleteUser]);
            return res.status(200).json({ message: "회원탈퇴 완료", state: true });
          }
        } catch (err) {
          return res.status(500).json({ message: "존재하지 않는 회원입니다.", err });
        }
      }
    );
  } catch {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};

export const mypage = async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.body;
    let tokenInfo: string | jwt.JwtPayload;
    try {
      tokenInfo = jwt.verify(token, process.env.ACCESS_SECRET);
    } catch {
      return res.status(403).json({ message: "로그인을 다시 해주세요.", state: false });
    }
    const userInfo = await client.user.findUnique({
      where: {
        email: tokenInfo["email"],
      },
      include: {
        products: true,
      },
    });
    delete userInfo.password;
    return res.status(200).json({ message: "마이페이지 접근 완료", userInfo, state: true });
  } catch {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};
