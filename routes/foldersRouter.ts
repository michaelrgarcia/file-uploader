import { Router } from "express";
import {
  createFolderGet,
  createFolderPost,
  foldersGet,
  viewFolderGet,
} from "../controllers/foldersController.js";

const foldersRouter = Router();

foldersRouter.get("/", foldersGet);

foldersRouter.get("/create", createFolderGet);
foldersRouter.post("/create", createFolderPost);

foldersRouter.get("/:folderId", viewFolderGet);

export default foldersRouter;
