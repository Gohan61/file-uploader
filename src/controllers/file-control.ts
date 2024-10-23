import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";

const prisma = new PrismaClient();

export const newFile = [
  asyncHandler(async (req: Request, res: Response, next): Promise<any> => {
    let file;

    if (req.file && req.user) {
      file = await prisma.files.create({
        data: {
          title: req.file.filename,
          ownerId: (req.user as User).id,
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
