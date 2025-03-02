import { NextFunction, Request, Response } from "express";

export function uploadGet(req: Request, res: Response) {
  res.render("upload");
}
