import { Request, Response } from "express";

export function foldersGet(req: Request, res: Response) {
  res.render("my-folders");
}
