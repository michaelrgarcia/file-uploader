import { Router } from "express";
import { indexGet } from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", indexGet);

export default indexRouter;
