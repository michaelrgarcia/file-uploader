import multer from "multer";

import { Router } from "express";

import {
  addFilesGet,
  addFilesPost,
  createFolderGet,
  createFolderPost,
  deleteFolderGet,
  deleteFolderPost,
  foldersGet,
  renameFolderGet,
  renameFolderPost,
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

foldersRouter.get("/:folderId/delete", deleteFolderGet);
foldersRouter.post("/:folderId/delete", deleteFolderPost);

foldersRouter.get("/:folderId/rename", renameFolderGet);
foldersRouter.post("/:folderId/rename", renameFolderPost);

// file routes

foldersRouter.get("/:folderId/file/:fileIndex", viewFileGet);

export default foldersRouter;
