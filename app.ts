import express, { Request, Response, NextFunction } from "express";
import expressSession from "express-session";
import passport from "./auth/passportConfig.js";

import indexRouter from "./routes/indexRouter.js";

import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const assetsPath = join(__dirname, "public");

const app = express();
const PORT = 3000;

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: "omen",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.session());

app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.currentUser = req.user;

  next();
});

app.use("/", indexRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(500).send("Internal Server Error");
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
