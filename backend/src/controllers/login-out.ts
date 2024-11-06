import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const signup = [
  body("username", "Username cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 20 })
    .withMessage("Username can be maximum 20 characters"),
  body("name")
    .trim()
    .optional()
    .isLength({ max: 100 })
    .withMessage("Name can be maximum 100 characters"),
  body("password", "Password cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 32 })
    .withMessage("Password can be maxium 32 characters"),

  asyncHandler(async (req, res, next): Promise<any> => {
    const errors = validationResult(req);
    const body: {
      username: string;
      name: string | undefined;
      password: string;
    } = req.body;

    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    try {
      const hashedPassword = bcrypt.hashSync(body.password, 10);

      const user = await prisma.user.create({
        data: {
          username: body.username,
          name: body.name,
          password: hashedPassword,
          folders: {
            create: {
              title: "main",
            },
          },
        },
      });

      return res.status(200).json({ message: "User saved" });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          return res.status(500).json({ errors: "Username already exists" });
        }
      }

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
        return res.status(404).json({ errors: err });
      } else if (!user) {
        return res.status(404).json({ errors: "User not found", user });
      } else {
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }

          return res.status(200).json({ ok: "ok" });
        });
      }
    })(req, res, next);
  }),
];

export const logout = asyncHandler(async (req, res, next): Promise<any> => {
  console.log(req);

  const sessionId: string | undefined = req.sessionID;

  try {
    if (sessionId) {
      await prisma.session.delete({
        where: {
          id: sessionId,
        },
      });
      return res.status(200).json({ message: "Logout successful" });
    } else {
      return res.status(404).json({ errors: "Something went wrong" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ errors: "Logout failed, please refresh your page" });
  }
});
