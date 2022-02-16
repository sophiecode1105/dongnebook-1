import express from "express";
import client from "../client";
import FuzzySearch from "fuzzy-search";
import { productFinder, userFinder, verify } from "../token/verify";

export const getAllProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { page } = req.query;
    const productLength = await client.product.findMany();
    const length = productLength.length;
    const allProductList = await client.product.findMany({
      where: {
        exchanged: false,
      },
      take: 4,
      cursor: {
        id: length - (Number(page) - 1) * 4,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        locations: true,
      },
    });

    return res.status(200).json({ message: "도서 목록 조회 성공", allProductList });
  } catch {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};

export const postProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { title, content, quality, token, lat, lon, address } = req.body;
    const data = verify(token);
    const userInfo = await userFinder(data["email"]);
    if (title && req.files[0] && content && quality) {
      const locationCreate = await client.location.create({
        data: {
          lat: Number(lat),
          lon: Number(lon),
          address,
          products: {
            create: {
              title,
              img: req.files[0].location,
              content,
              quality,
              userNickname: userInfo.nickname,
            },
          },
        },
      });
      const productInfo = await productFinder(locationCreate.id);

      return res.status(201).json({ message: "도서 업로드 성공", productInfo: productInfo[0] });
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
      include: {
        locations: true,
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
    const { title, img, content, quality, token, lat, lon, address } = req.body;

    const findId = Number(id);
    const data = verify(token);
    const userInfo = await userFinder(data["email"]);
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
  } catch {
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다.", state: false });
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

export const postLike = async (req: express.Request, res: express.Response) => {
  try {
    console.log("접근완료");
    const { token } = req.body;
    const { id } = req.params;
    const userInfo = verify(token);

    // await client.product.findMany({
    //   where: {
    //     likes: {
    //       some,
    //     },
    //   },
    // });

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

    res.status(200).json({ message: "찜하기 성공", result });
  } catch {
    res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
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
