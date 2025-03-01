import { Request, Response } from "express";

export function indexGet(req: Request, res: Response) {
  res.render("index");
}
