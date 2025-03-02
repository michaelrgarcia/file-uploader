import { Router } from "express";
import {
  createFolderGet,
  createFolderPost,
  foldersGet,
} from "../controllers/foldersController.js";

const foldersRouter = Router();

foldersRouter.get("/", foldersGet);

foldersRouter.get("/create", createFolderGet);
foldersRouter.post("/create", createFolderPost);

export default foldersRouter;
