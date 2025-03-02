import multer from "multer";

import { Router, Request, Response, NextFunction } from "express";

import {
  addFilesGet,
  addFilesPost,
  createFolderGet,
  createFolderPost,
  foldersGet,
  viewFileGet,
  viewFolderGet,
} from "../controllers/foldersController.js";

const foldersRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

foldersRouter.get("/", foldersGet);

foldersRouter.get("/create", createFolderGet);
foldersRouter.post("/create", createFolderPost);

foldersRouter.get("/:folderId", viewFolderGet);

foldersRouter.get("/:folderId/add", addFilesGet);
foldersRouter.post("/:folderId/add", upload.single("file"), addFilesPost);

foldersRouter.get("/:folderId/file/:fileIndex", viewFileGet);

export default foldersRouter;
