import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import express, { Request, Response } from "express";

export const signin = [
  asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({ message: "Okay" });
  }),
];
