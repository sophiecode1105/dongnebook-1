import express from "express";
import client from "../client";
import FuzzySearch from "fuzzy-search";
import { productFinder, userFinder, verify } from "../token/verify";
import { create } from "domain";
import { url } from "inspector";

export const getAllProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { page } = req.query;
    const target = await client.product.findMany({ orderBy: { id: "desc" } });

    const allProductList = await client.product.findMany({
      where: {
        exchanged: false,
      },
      take: 4,
      cursor: {
        id: target[0].id - (Number(page) - 1) * 4,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        locations: true,
        images: true,
      },
    });

    if (allProductList.length === 0) {
      return res.status(400).json({ message: "빈 페이지 입니다.", allProductList, state: false });
    }

    return res.status(200).json({ message: "도서 목록 조회 성공", allProductList, state: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const postProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { title, content, quality, token, lat, lon, address } = req.body;

    const data = verify(token);

    const userInfo = await userFinder(data["email"]);
    const imgs = req.files;
    const url = [];
    for (let i = 0; i < imgs.length; i++) {
      url.push({ url: imgs[i].location });
    }

    if (title && req.files[0] && content && quality) {
      const locationCreate = await client.location.create({
        data: {
          lat: Number(lat),
          lon: Number(lon),
          address,

          products: {
            create: {
              title,
              images: { createMany: { data: url } },
              content,
              quality,
              userNickname: userInfo.nickname,
            },
          },
        },
      });
      const productInfo = await productFinder(locationCreate.id);

      return res.status(201).json({ message: "도서 업로드 성공", productInfo: productInfo[0], status: true });
    } else {
      return res.status(400).json({ message: "도서 정보를 모두 입력해주세요.", status: false });
    }
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
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
      include: {
        locations: true,
        images: true,
      },
    });

    if (productInfo) {
      const likeCount = await client.liked.count({
        where: {
          productId: findId,
        },
      });

      await client.product.update({
        where: {
          id: findId,
        },
        data: {
          visit: {
            increment: 1,
          },
        },
      });

      return res.status(201).json({ message: "도서 상세보기 성공", productInfo, likeCount });
    } else {
      return res.status(400).json({ message: "해당도서가 없습니다." });
    }
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};
export const putProduct = async (req: express.Request, res: express.Response) => {
  try {
    let { id } = req.params;
    const { title, content, quality, token, lat, lon, address } = req.body;

    const findId = Number(id);
    const data = verify(token);
    const userInfo = await userFinder(data["email"]);

    const imgs = req.files;
    const url = [];
    for (let i = 0; i < imgs.length; i++) {
      url.push({ url: imgs[i].location, productId: findId });
    }
    console.log(url);
    const productInfo = await client.product.findMany({
      where: {
        userNickname: userInfo.nickname,
      },
    });
    await client.location.update({
      where: {
        id: productInfo[0].locationId,
      },
      data: {
        lat: Number(lat),
        lon: Number(lon),
        address,
      },
    });
    await client.image.deleteMany({
      where: {
        productId: findId,
      },
    });
    await client.image.createMany({
      data: url,
    });
    const updateProductInfo = await client.product.update({
      where: {
        id: findId,
      },
      data: {
        title,
        content,
        quality,
        exchanged: true,
        userNickname: userInfo.nickname,
      },
    });

    return res.status(200).json({ message: "도서 정보 수정 성공", updateProductInfo, status: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};
export const exchangedProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    await client.product.update({
      where: {
        id: Number(id),
      },
      data: {
        exchanged: true,
      },
    });
    return res.status(200).json({ message: "거래가 완료되었습니다.", state: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const deleteProduct = async (req: express.Request, res: express.Response) => {
  try {
    let { id } = req.params;
    const findId = Number(id);
    try {
      await client.product.delete({ where: { id: findId } });
    } catch (err) {
      return res.status(400).json({ message: "존재하지 않는 도서입니다.", status: false, err });
    }
    return res.status(200).json({ message: "도서 삭제 성공", status: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const postLike = async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.body;

    const { id } = req.params;
    let userInfo;
    try {
      userInfo = verify(token);
    } catch (err) {
      return res.status(401).json({ message: "로그인이 필요합니다", status: false, err });
    }

    const likeCheck = await client.liked.findMany({
      where: {
        userId: userInfo["id"],
        productId: Number(id),
      },
    });

    if (likeCheck.length !== 0) {
      await client.liked.deleteMany({
        where: {
          userId: userInfo["id"],
          productId: Number(id),
        },
      });
      return res.status(200).json({ message: "찜하기 취소", status: true });
    }
    const result = await client.product.update({
      where: {
        id: Number(id),
      },
      data: {
        likes: {
          create: {
            userId: userInfo["id"],
          },
        },
      },
    });

    return res.status(201).json({ message: "찜하기 성공", result, status: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const searchProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { type, value } = req.query;

    const product = await client.product.findMany({
      where: {
        exchanged: false,
      },
    });

    const searcher = new FuzzySearch(product, [type as string], {
      caseSensitive: true,
    });
    const result = searcher.search(value as string);

    return res.status(200).json({ message: "도서 찾기 성공", result, status: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};
