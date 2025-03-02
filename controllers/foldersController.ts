import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export async function foldersGet(req: Request, res: Response) {
  const prisma = new PrismaClient();

  const folders = await prisma.folder.findMany({
    where: {
      creatorId: Number((req.user as any).id),
    },
  });

  res.render("my-folders", { folders });
}

export function createFolderGet(req: Request, res: Response) {
  res.render("create-folder");
}

export async function createFolderPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { folderName } = req.body;

  try {
    if (!req.user) throw new Error("Please log in create a folder.");

    const prisma = new PrismaClient();

    await prisma.folder.create({
      data: {
        name: folderName,
        creatorId: (req.user as any).id,
      },
    });

    res.redirect("/my-folders");
  } catch (err: any) {
    console.error(err);

    return next(err);
  }
}
