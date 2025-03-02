import multer from "multer";

import { Router, Request, Response, NextFunction } from "express";

import fileRouter from "./fileRouter.js";

import {
  addFilesGet,
  addFilesPost,
  createFolderGet,
  createFolderPost,
  foldersGet,
  viewFolderGet,
} from "../controllers/foldersController.js";

const foldersRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

foldersRouter.use("/:folderId/file", fileRouter);

foldersRouter.get("/", foldersGet);

foldersRouter.get("/create", createFolderGet);
foldersRouter.post("/create", createFolderPost);

foldersRouter.get("/:folderId", viewFolderGet);

foldersRouter.get("/:folderId/add", addFilesGet);
foldersRouter.post("/:folderId/add", upload.single("file"), addFilesPost);

export default foldersRouter;
