import express from "express";
import client from "../client";
import nodemailer from "nodemailer";
// import { PrismaClient } from ".prisma/client";

// const prisma = new PrismaClient();
export const postCertify = async (req: express.Request, res: express.Response) => {
  const { email, nickname } = req.body;

  const existUser = await client.user.findUnique({
    where: {
      email,
    },
  });
  console.log("유저가 존재하나요?", existUser);
  if (!existUser) {
    let number = Math.floor(Math.random() * 1000000) + 100000; // ★★난수 발생 ★★★★★
    if (number > 1000000) {
      // ★★
      number = number - 100000; // ★★
    }

    let transporter = nodemailer.createTransport({
      service: "naver", //사용하고자 하는 서비스
      port: 587,
      host: "smtp.naver.com",
      secure: false,
      requireTLS: true,
      auth: {
        user: "malove0330@naver.com", //gmail주소입력
        pass: "tkfkddms12!@", //gmail패스워드 입력
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
        <h2>${nickname}님, 안녕하세요.</h2> <br/> <h2>제목: 졸리죠</h2> <br/>자러가요 인증번호를 올바르게 입력해주세요.<br/>
        인증번호는 ${number} 입니다.
        <br/><br/><br/><br/></div>`,
    });

    return res.json({ message: "인증 성공" }); // 클라이언트에게 보내기
  } else {
    return res.json({ message: "이미 가입된 회원입니다.", existUser });
  }
};
