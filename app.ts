import express, { Request, Response, NextFunction } from "express";

import indexRouter from "./routes/indexRouter.js";

import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const assetsPath = join(__dirname, "public");

const app = express();
const PORT = 3000;

app.use("/", indexRouter);

app.use(express.static(assetsPath));

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(500).send(err.message);
});
