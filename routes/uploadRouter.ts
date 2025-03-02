import multer from "multer";

import { Router, Request, Response, NextFunction } from "express";
import { uploadGet } from "../controllers/uploadController.js";

const uploadRouter = Router();

const upload = multer({ dest: "uploads/" });

uploadRouter.get("/", uploadGet);
uploadRouter.post(
  "/",
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render("upload", { message: "Upload successful! " });
    } catch (err: any) {
      console.error(err);

      return next(err);
    }
  }
);

export default uploadRouter;
