import express from "express";
import {
  deleteProduct,
  exchangedProduct,
  getAllProduct,
  getOneProduct,
  postLike,
  postProduct,
  putProduct,
  searchProduct,
} from "../controllers/productController";

import { upload } from "../middleware/upload";
const productRouter = express.Router();

productRouter.route("/list").get(getAllProduct);

productRouter.route("/post").post(upload.array("file", 4), postProduct);

productRouter
  .route("/:id(\\d+)")
  .post(postLike)
  .get(getOneProduct)
  .patch(upload.array("file", 4), putProduct)
  .delete(deleteProduct);

productRouter.route("/search").get(searchProduct);

productRouter.route("/:id(\\d+)/exchange").patch(exchangedProduct);
export default productRouter;
