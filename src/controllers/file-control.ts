import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";

const prisma = new PrismaClient();

export const newFile = [
  body("title").trim().isLength({ min: 1 }),

  asyncHandler(async (req: Request, res: Response, next): Promise<any> => {
    let file;
    const body: { folderId: number; sendTime: number } = req.body;
    const user = req.user as User | undefined;
    const uploadTimeSeconds = Math.round(
      Number(Date.now() - body.sendTime) / 1000
    );
    const sizeInMB =
      (Number(req.file?.size) / (1024 * 1024)).toFixed(2) + " MB";

    if (req.file && user) {
      file = await prisma.files.create({
        data: {
          title: req.file.filename,
          ownerId: Number(user.id),
          folderId: body.folderId,
          size: sizeInMB,
          uploadTime: uploadTimeSeconds,
          link: "test",
        },
      });

      if (file) {
        return res.status(200).json({ message: "File uploaded" });
      }
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }),
];

export const deleteFile = asyncHandler(
  async (req: Request, res: Response, next): Promise<any> => {
    const fileId: number = Number(req.params.file);
    const file = await prisma.files.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!file) {
      return res.status(500).json({ error: "File not found" });
    }

    await prisma.files.delete({
      where: {
        id: file.id,
      },
    });

    return res.status(200).json({ message: "File deleted" });
  }
);

export const getFile = asyncHandler(async (req, res, next): Promise<any> => {
  const fileId = Number(req.params.fileId);
  const file = await prisma.files.findUnique({
    where: {
      id: fileId,
    },
  });
});
