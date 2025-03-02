import { Router } from "express";
import {
  indexGet,
  registerGet,
  registerPost,
} from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", indexGet);

indexRouter.get("/register", registerGet);
indexRouter.post("/register", registerPost as any);

export default indexRouter;
