import { Router } from "express";
import { uploadGet } from "../controllers/uploadController.js";

const uploadRouter = Router();

uploadRouter.get("/", uploadGet);

export default uploadRouter;
