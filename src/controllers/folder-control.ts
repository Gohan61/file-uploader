import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const newFolder = [
  body("title", "Title cannot be empty").trim().isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const body: { title: string } = req.body;
    const fileName = await prisma.folder.findUnique({
      where: {
        title: body.title,
      },
    });

    if (!errors.isEmpty()) {
      res.status(500).json({ errors: errors.array() });
    } else if (fileName) {
      res.status(500).json({ message: "Folder title already exists" });
    } else {
      await prisma.folder.create({
        data: {
          title: body.title,
        },
      });
      res.status(200).json({ message: "Folder created" });
    }
  }),
];

export const getFolder = asyncHandler(async (req, res, next): Promise<any> => {
  const body: { title: string } = req.body;
  const folder = await prisma.folder.findMany({
    where: {
      title: body.title,
    },
    include: {
      files: true,
    },
  });

  if (!folder) {
    return res.status(404).json({ error: "Could not find folder" });
  } else {
    return res.status(200).json({ folder: folder });
  }
});

export const deleteFolder = asyncHandler(
  async (req, res, next): Promise<any> => {
    const fileTitle: string = req.params.title;
    const folder = await prisma.folder.findUnique({
      where: {
        title: fileTitle,
      },
    });

    if (!folder) {
      return res.status(404).json({ error: "Could not find folder" });
    } else {
      await prisma.folder.delete({
        where: {
          title: fileTitle,
        },
      });
      return res.status(200).json({ message: "Folder deleted" });
    }
  }
);

export const updateFolder = [
  body("newTitle", "Title cannot be empty").trim().isLength({ min: 1 }),

  asyncHandler(async (req, res, next): Promise<any> => {
    const errors = validationResult(req);
    const body: { id: string; newTitle: string } = req.body;
    const title: string = req.params.title;

    if (!errors.isEmpty()) {
      res.status(500).json({ errors: errors.array() });
    }

    const file = await prisma.folder.findUnique({
      where: {
        title: body.newTitle,
        NOT: {
          id: Number(body.id),
        },
      },
    });

    if (file) {
      return res.status(500).json({ message: "Folder name already exists" });
    } else {
      await prisma.folder.update({
        where: {
          id: Number(body.id),
        },
        data: {
          title: body.newTitle,
        },
      });

      return res.status(200).json({ message: "Folder name changed" });
    }
  }),
];
