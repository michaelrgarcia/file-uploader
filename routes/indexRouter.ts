import { Router } from "express";
import passport from "../auth/passportConfig.js";

import {
  indexGet,
  loginGet,
  logoutGet,
  registerGet,
  registerPost,
} from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", indexGet);

indexRouter.get("/register", registerGet);
indexRouter.post("/register", registerPost as any);

indexRouter.get("/login", loginGet);
indexRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

indexRouter.get("/logout", logoutGet);

export default indexRouter;
