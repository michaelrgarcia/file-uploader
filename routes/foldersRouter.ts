import multer from "multer";

import { Router, Request, Response, NextFunction } from "express";

import {
  addFilesGet,
  createFolderGet,
  createFolderPost,
  foldersGet,
  viewFolderGet,
} from "../controllers/foldersController.js";

const foldersRouter = Router();

const upload = multer({ dest: "uploads/" }); // TEMP

foldersRouter.get("/", foldersGet);

foldersRouter.get("/create", createFolderGet);
foldersRouter.post("/create", createFolderPost);

foldersRouter.get("/:folderId", viewFolderGet);

foldersRouter.get("/:folderId/add", addFilesGet);
foldersRouter.post(
  "/:folderId/add",
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // do supabase stuff here
      res.render("upload", { message: "Upload successful! " });
    } catch (err: any) {
      console.error(err);

      return next(err);
    }
  }
);

export default foldersRouter;
