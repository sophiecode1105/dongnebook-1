import express from "express";
import client from "../client";
import FuzzySearch from "fuzzy-search";
import { userFinder, verify } from "../token/verify";

export const getAllProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { page } = req.body;
    const productLength = await client.product.findMany();
    const length = productLength.length;
    const allProductList = await client.product.findMany({
      take: 4,
      cursor: {
        id: length - (page - 1) * 4,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json({ message: "도서 목록 조회 성공", allProductList });
  } catch {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};

export const postProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { title, content, quality, token } = req.body;
    const data = verify(token);
    const userInfo = await userFinder(data["email"]);

    if (title && req.files[0].location && content && quality) {
      const productInfo = await client.product.create({
        data: {
          title,
          img: req.files[0].location,
          content,
          quality,
          exchanged: true,
          userNickname: userInfo.nickname,
        },
      });
      return res.status(201).json({ message: "도서 업로드 성공", productInfo });
    } else {
      return res.status(400).json({ message: "도서 정보를 모두 입력해주세요." });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};
export const getOneProduct = async (req: express.Request, res: express.Response) => {
  try {
    let { id } = req.params;
    const findId = Number(id);

    const productInfo = await client.product.findUnique({
      where: {
        id: findId,
      },
    });
    if (productInfo) {
      return res.status(201).json({ message: "도서 상세보기 성공", productInfo });
    } else {
      return res.status(400).json({ message: "해당도서가 없습니다." });
    }
  } catch {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};
export const putProduct = async (req: express.Request, res: express.Response) => {
  try {
    let { id } = req.params;
    const { title, img, content, quality, token } = req.body;
    const findId = Number(id);
    const data = verify(token);
    const userInfo = await userFinder(data["email"]);
    const updateProductInfo = await client.product.update({
      where: {
        id: findId,
      },
      data: {
        title,
        img,
        content,
        quality,
        exchanged: true,
        userNickname: userInfo.nickname,
      },
    });
    return res.status(201).json({ message: "도서 정보 수정 성공", updateProductInfo });
  } catch {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};

export const deleteProduct = async (req: express.Request, res: express.Response) => {
  try {
    let { id } = req.params;
    const findId = Number(id);
    try {
      await client.product.delete({ where: { id: findId } });
    } catch {
      return res.status(200).json({ message: "존재하지 않는 도서입니다." });
    }
    return res.status(200).json({ message: "도서 삭제 성공" });
  } catch {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};
export const searchProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { type, value } = req.query;

    const product = await client.product.findMany();

    const searcher = new FuzzySearch(product, [type as string], {
      caseSensitive: true,
    });
    const result = searcher.search(value as string);

    res.status(200).json({ message: "도서 찾기 성공", result });
  } catch {
    res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};
