import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const signup = [
  body("username", "Username cannot be empty").trim().isLength({ min: 1 }),
  body("name").trim().optional(),
  body("password", "Password cannot be empty").trim().isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    try {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        const user = await prisma.user.create({
          data: {
            username: req.body.username,
            name: req.body.name,
            password: hashedPassword,
          },
        });
        if (!errors.isEmpty()) {
          res.status(500).json({ errors: errors.array(), user: user });
        } else {
          res.status(200).json({ message: "User saved" });
        }
      });
    } catch (err) {
      return next(err);
    }
  }),
];

export const signin = [
  body("username").trim().isLength({ min: 1 }),
  body("password").trim().isLength({ min: 1 }),

  asyncHandler(async (req: Request, res: Response, next): Promise<any> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(404)
        .json({ message: "Could not login user", errors: errors.array() });
    }

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(404).json({ error: "User not found", user });
      } else {
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
        });
        return res.status(200);
      }
    })(req, res, next);
  }),
];
