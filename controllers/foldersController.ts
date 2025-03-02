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
    if (!req.user) throw new Error("Please log in to add files.");

    const { file } = req;
    const { folderId } = req.params;

    if (!file) throw new Error("No file provided.");

    const fileBase64 = decode(file.buffer.toString("base64"));

    const supabase = createClient(
      String(process.env.SUPABASE_PROJECT_URL),
      String(process.env.SUPABASE_API_KEY)
    );

    const { data, error } = await supabase.storage
      .from(String(process.env.SUPABASE_BUCKET_ID))
      .upload(file.originalname, fileBase64);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from(String(process.env.SUPABASE_BUCKET_ID))
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

export async function viewFileGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { folderId, fileIndex } = req.params;

  try {
    const prisma = new PrismaClient();

    const folder = await prisma.folder.findUnique({
      where: {
        id: Number(folderId),
      },
    });

    const fileUrl = String(folder?.files[Number(fileIndex)]);

    const fileData = await fetch(fileUrl);
    const file = await fileData.blob();

    const urlParts = fileUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];

    res.render("file-info", {
      fileInfo: {
        name: fileName,
        size: file.size,
        uploadTime: fileData.headers.get("last-modified"),
      },
      folderName: folder?.name,
      folderId: folder?.id,
    });
  } catch (err: any) {
    console.error(err);

    return next(err);
  }
}

export async function deleteFolderGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { folderId } = req.params;

    const prisma = new PrismaClient();

    const folder = await prisma.folder.findUniqueOrThrow({
      where: {
        id: Number(folderId),
      },
    });

    res.render("delete-folder", { folder });
  } catch (err: any) {
    console.error(err);

    return next(err);
  }
}

export async function deleteFolderPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) throw new Error("Please log in delete a folder.");

    const { folderId } = req.params;

    const prisma = new PrismaClient();

    const folder = await prisma.folder.findUniqueOrThrow({
      where: {
        id: Number(folderId),
      },
    });

    const fileNames = folder.files.map((file) => {
      const parts = file.split("/");
      const fileName = parts[parts.length - 1];

      return "/" + fileName;
    });

    const supabase = createClient(
      String(process.env.SUPABASE_PROJECT_URL),
      String(process.env.SUPABASE_API_KEY)
    );

    const { error } = await supabase.storage
      .from(String(process.env.SUPABASE_BUCKET_ID))
      .remove(fileNames);

    if (error) throw error;

    await prisma.folder.delete({
      where: {
        id: Number(folderId),
      },
    });

    res.redirect("/my-folders");
  } catch (err: any) {
    console.error(err);

    return next(err);
  }
}

export async function renameFolderGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { folderId } = req.params;

    const prisma = new PrismaClient();

    const folder = await prisma.folder.findUniqueOrThrow({
      where: {
        id: Number(folderId),
      },
    });

    res.render("rename-folder", { folder });
  } catch (err: any) {
    console.error(err);

    return next(err);
  }
}

export async function renameFolderPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) throw new Error("Please log in rename a folder.");

    const { folderName } = req.body;
    const { folderId } = req.params;

    const prisma = new PrismaClient();

    await prisma.folder.update({
      where: {
        id: Number(folderId),
      },
      data: {
        name: folderName,
      },
    });

    res.redirect("/my-folders");
  } catch (err: any) {
    console.error(err);

    return next(err);
  }
}
