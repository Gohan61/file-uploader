import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import express, { Request, response, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { handleUpload } from "../config/upload";
import { handleDelete } from "../config/upload";
const { Readable } = require("stream");
import { pipeline } from "node:stream/promises";

const prisma = new PrismaClient();

export const newFile = [
  body("title").trim().isLength({ min: 1 }),

  asyncHandler(async (req: Request, res: Response, next): Promise<any> => {
    let file;
    const body: { folderId: string; sendTime: string } = req.body;
    const user = req.user as User | undefined;

    if (req.file && user) {
      try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataUri = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataUri);

        const uploadTimeSeconds = Math.round(
          (Date.now() - Number(body.sendTime)) / 1000
        );
        const sizeInMB =
          (Number(req.file?.size) / (1024 * 1024)).toFixed(2) + " MB";
        const ownerId = Number(user.id);
        const folderId = Number(body.folderId);
        const createdAt = format(new Date(), "PPPP");
        const fileName: string = req.file.originalname;

        file = await prisma.files.create({
          data: {
            title: fileName,
            ownerId: ownerId,
            folderId: folderId,
            createdAt: createdAt,
            size: sizeInMB,
            uploadTime: uploadTimeSeconds,
            link: cldRes.url,
            publicId: cldRes.public_id,
          },
        });

        if (file) {
          return res.status(200).json({ message: "File uploaded" });
        }
      } catch (err) {
        return res.status(500).json({ errors: "Something went wrong" });
      }
    } else if (req.file === undefined) {
      return res.status(500).json({ errors: "No file selected" });
    } else {
      return res.status(500).json({ errors: "Something went wrong" });
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

    try {
      await prisma.files.delete({
        where: {
          id: file.id,
        },
      });

      const deleteCloud = await handleDelete(file.publicId!);

      if (deleteCloud.result != "ok") {
        return res.status(500).json({ errors: deleteCloud.result });
      }

      return res.status(200).json({ message: "File deleted" });
    } catch (err) {
      return res.status(500).json({ errors: err });
    }
  }
);

export const getFile = asyncHandler(async (req, res, next): Promise<any> => {
  const fileId = Number(req.params.fileId);
  const file = await prisma.files.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }

  try {
    const cloudinaryFile = await fetch(`${file.link}`);

    if (!cloudinaryFile.ok) {
      return res
        .status(500)
        .json({ errors: `Failed to fetch file: ${cloudinaryFile.statusText}` });
    }

    res.setHeader(
      "Content-Type",
      cloudinaryFile.headers.get("content-type") || "application/octet-stream"
    );

    res.setHeader("Content-Disposition", `attachment; filename=${file.title}`);
    await pipeline(Readable.from(cloudinaryFile.body), res);
  } catch (err) {
    return res.status(500).json({ errors: err });
  }
});

export const updateFile = [
  body("newTitle", "Title cannot be empty").trim().isLength({ min: 1 }),

  asyncHandler(async (req, res, next): Promise<any> => {
    const errors = validationResult(req);
    const fileId = Number(req.params.fileId);
    const file = await prisma.files.findUnique({
      where: {
        id: fileId,
      },
    });
    const user = req.user as User | undefined;
    const folderId: number = Number(req.body.folderId);
    const newTitle: string = req.body.newTitle;
    let newFolder;

    if (user) {
      newFolder = await prisma.folder.findUnique({
        where: {
          id: folderId,
          userId: (req.user as User).id,
        },
      });
    }

    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    } else if (!file || !newFolder) {
      return res.status(500).json({ errors: "Folder or file does not exist" });
    } else {
      const updateFile = await prisma.files.update({
        where: {
          id: fileId,
        },
        data: {
          folderId: newFolder.id,
          title: newTitle,
        },
      });

      return res.status(200).json({ message: "File updated" });
    }
  }),
];
