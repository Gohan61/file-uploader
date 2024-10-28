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
    const body: { folderId: number } = req.body;
    const user = req.user as User | undefined;

    if (req.file && user) {
      file = await prisma.files.create({
        data: {
          title: req.file.filename,
          ownerId: Number(user.id),
          folderId: body.folderId,
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
