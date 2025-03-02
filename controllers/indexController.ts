import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";

import { validateRegister } from "./validators/indexValidators.js";

export function indexGet(req: Request, res: Response) {
  res.render("index");
}

export function registerGet(req: Request, res: Response) {
  res.render("register");
}

export const registerPost = [
  validateRegister,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("register", {
        errors: errors.array(),
      });
    }

    const { username, password } = req.body;

    const hashedPassword = await hash(password, 10);

    try {
      const prisma = new PrismaClient();

      await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      res.redirect("/login");
    } catch (err: any) {
      console.error(err);

      return next(err);
    }
  },
];

export function loginGet(req: Request, res: Response) {
  res.render("login");
}
