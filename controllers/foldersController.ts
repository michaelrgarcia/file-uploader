import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";

config();

export async function foldersGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const prisma = new PrismaClient();

    const folders = await prisma.folder.findMany({
      where: {
        creatorId: Number((req.user as any).id),
      },
    });

    res.render("my-folders", { folders });
  } catch (err: any) {
    console.error(err);

    return next(err);
  }
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

export async function viewFolderGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { folderId } = req.params;

  try {
    const prisma = new PrismaClient();

    const folder = await prisma.folder.findUnique({
      where: {
        id: Number(folderId),
      },
    });

    res.render("folder-contents", { folder });
  } catch (err: any) {
    console.error(err);

    return next(err);
  }
}

export function addFilesGet(req: Request, res: Response) {
  const { folderId } = req.params;

  res.render("upload", { folderId });
}

export async function addFilesPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { file } = req;
    const { folderId } = req.params;

    if (!file) throw new Error("No file provided.");

    const fileBase64 = decode(file.buffer.toString("base64"));

    const supabase = createClient(
      String(process.env.SUPABASE_PROJECT_URL),
      String(process.env.SUPABASE_API_KEY)
    );

    const { data, error } = await supabase.storage
      .from("odin-file-uploader")
      .upload(file.originalname, fileBase64);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("odin-file-uploader")
      .getPublicUrl(data.path);

    const prisma = new PrismaClient();

    await prisma.folder.update({
      where: {
        id: Number(folderId),
      },
      data: {
        files: {
          push: publicUrl.publicUrl,
        },
      },
    });

    res.render("upload", { message: "Upload successful! " });
  } catch (err: any) {
    console.error(err);

    return next(err);
  }
}
