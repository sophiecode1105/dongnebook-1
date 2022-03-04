import express from "express";
import client from "../client";
import FuzzySearch from "fuzzy-search";
import { productFinder, userFinder, verify } from "../token/verify";
import { JwtPayload } from "jsonwebtoken";

export const getAllProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { page } = req.query;
    const target = await client.product.findMany({
      where: {
        exchanged: false,
      },
      orderBy: { id: "desc" },
    });

    if (target.length === 0) {
      return res
        .status(200)
        .json({ message: "빈 페이지 입니다.", allProductList: target, state: false });
    }
    const take = 12;
    const allProductList = await client.product.findMany({
      where: {
        exchanged: false,
      },
      take,
      cursor: {
        id: target[0].id - (Number(page) - 1) * take,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        locations: true,
        images: true,
      },
    });

    const pages = Math.ceil(target.length / take);

    if (allProductList.length === 0) {
      return res
        .status(200)
        .json({ message: "빈 페이지 입니다.", allProductList, state: false, pages });
    }

    return res
      .status(200)
      .json({ message: "도서 목록 조회 성공", allProductList, state: true, pages });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const postProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { title, content, quality, lat, lon, address } = req.body;
    const authorization = req.headers.authorization;

    const data = verify(authorization.split(" ")[1]);

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
              nickname: userInfo.nickname,
            },
          },
        },
      });
      const productInfo = await productFinder(locationCreate.id);

      return res
        .status(201)
        .json({ message: "도서 업로드 성공", productInfo: productInfo[0], status: true });
    } else {
      return res.status(400).json({ message: "도서 정보를 모두 입력해주세요.", status: false });
    }
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};
export const getOneProduct = async (req: express.Request, res: express.Response) => {
  try {
    const authorization = req.headers.authorization;

    let { productId } = req.params;
    const findId = Number(productId);

    let isLike: any;
    if (authorization) {
      let token;
      try {
        token = verify(authorization.split(" ")[1]);
      } catch (err) {
        return res.status(401).json({ message: "로그인을 다시해주세요", err });
      }
      const checkLike = await client.product.findMany({
        where: {
          id: findId,
          likes: {
            some: {
              userId: token["id"],
            },
          },
        },
      });
      isLike = checkLike.length === 0 ? false : true;
    }

    const productInfo = await client.product.findUnique({
      where: {
        id: findId,
      },
      include: {
        locations: true,
        images: true,
        users: true,
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

      return res
        .status(200)
        .json({ message: "도서 상세보기 성공", productInfo, isLike, likeCount });
    } else {
      return res.status(400).json({ message: "해당도서가 없습니다." });
    }
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const putProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { productId } = req.params;
    const { title, content, quality, lat, lon, address, url } = req.body;
    console.log(address);
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(400).json({ message: "로그인이 필요한 서비스 입니다.", status: false });
    }

    const data = verify(authorization.split(" ")[1]);

    let urls = [];

    if (url) {
      Array.isArray(url)
        ? url.forEach((el) => {
            urls.push(JSON.parse(el));
          })
        : urls.push(JSON.parse(url));
    }
    const findId = Number(productId);

    const userInfo = await userFinder(data["email"]);

    const isMine = await client.product.findMany({
      where: {
        id: Number(productId),
        users: {
          id: userInfo.id,
        },
      },
    });
    if (isMine.length === 0) {
      return res.status(400).json({ message: "글쓴이만 수정이 가능합니다.", status: false });
    }

    const imgs = req.files;

    for (let i = 0; i < imgs.length; i++) {
      urls.push({ url: imgs[i].location, productId: findId });
    }
    await client.image.deleteMany({
      where: {
        productId: findId,
      },
    });
    await client.image.createMany({
      data: urls,
    });

    const productInfo = await client.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    await client.location.update({
      where: {
        id: productInfo.locationId,
      },
      data: {
        lat: Number(lat),
        lon: Number(lon),
        address,
      },
    });

    const updateProductInfo = await client.product.update({
      where: {
        id: findId,
      },
      data: {
        title,
        content,
        quality,
        nickname: userInfo.nickname,
      },
      include: {
        images: true,
        locations: true,
      },
    });

    return res
      .status(200)
      .json({ message: "도서 정보 수정 성공", updateProductInfo, status: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const exchangedProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { productId } = req.params;

    const productInfo = await client.product.findUnique({
      where: {
        id: Number(productId),
      },
    });
    await client.product.update({
      where: {
        id: Number(productId),
      },
      data: {
        exchanged: !productInfo.exchanged,
      },
      include: {
        locations: true,
      },
    });

    return res.status(200).json({ message: "거래상태가 변경되었습니다.", state: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};

export const deleteProduct = async (req: express.Request, res: express.Response) => {
  try {
    let { productId } = req.params;
    const findId = Number(productId);

    const productInfo = await client.product.findUnique({
      where: {
        id: findId,
      },
    });

    try {
      await client.location.delete({ where: { id: productInfo.locationId } });
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
    const authorization = req.headers.authorization;

    const { productId } = req.params;
    let userInfo: string | JwtPayload;
    try {
      userInfo = verify(authorization.split(" ")[1]);
    } catch (err) {
      return res.status(401).json({ message: "로그인이 필요합니다", status: false, err });
    }

    const likeCheck = await client.liked.findMany({
      where: {
        userId: userInfo["id"],
        productId: Number(productId),
      },
    });

    if (likeCheck.length !== 0) {
      await client.liked.deleteMany({
        where: {
          userId: userInfo["id"],
          productId: Number(productId),
        },
      });
      return res.status(200).json({ message: "찜하기 취소", isLike: false, status: true });
    }
    const result = await client.product.update({
      where: {
        id: Number(productId),
      },
      data: {
        likes: {
          create: {
            userId: userInfo["id"],
          },
        },
      },
    });

    return res.status(201).json({ message: "찜하기 성공", result, isLike: true, status: true });
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
      include: {
        locations: true,
        images: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    const searcher = new FuzzySearch(product, [type as string], {
      caseSensitive: true,
    });
    const result = searcher.search(value as string);
    const pages = Math.ceil(result.length / 12);

    return res.status(200).json({ message: "도서 찾기 성공", pages, result, status: true });
  } catch (err) {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", err });
  }
};
