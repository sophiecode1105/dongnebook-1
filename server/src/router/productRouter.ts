import express from "express";
import { deleteProduct, getAllProduct, getOneProduct, postProduct, putProduct } from "../controllers/productController";
const productRouter = express.Router();

productRouter.route("/list").get(getAllProduct);

productRouter.route("/post").post(postProduct);

productRouter.route("/:id(\\d+)").get(getOneProduct).put(putProduct).delete(deleteProduct);

export default productRouter;
