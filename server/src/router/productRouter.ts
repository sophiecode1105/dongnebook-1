import express from "express";
import {
  deleteProduct,
  getAllProduct,
  getOneProduct,
  postProduct,
  putProduct,
  searchProduct,
} from "../controllers/productController";

import { upload } from "../middleware/upload";
const productRouter = express.Router();

productRouter.route("/list").get(getAllProduct);

productRouter.route("/post").post(upload.array("file"), postProduct);

productRouter.route("/:id(\\d+)").get(getOneProduct).put(upload.array("file"), putProduct).delete(deleteProduct);

productRouter.route("/search").get(searchProduct);
export default productRouter;
