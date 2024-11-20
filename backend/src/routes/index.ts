import express, { Router, Request, Response } from "express";
import { logout, signin, signup } from "../controllers/login-out";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  handler: (req, res, next, options) =>
    res
      .status((options.statusCode = 429))
      .json({ errors: "Too many requests, please try again in 10 minutes" }),
});

export const router: Router = express.Router();

router.post("/signin", limiter, signin);

router.post("/signup", signup);

router.get("/logout", logout);
