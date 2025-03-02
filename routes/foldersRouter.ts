import { Router } from "express";
import { foldersGet } from "../controllers/foldersController.js";

const foldersRouter = Router();

foldersRouter.get("/", foldersGet);

export default foldersRouter;
