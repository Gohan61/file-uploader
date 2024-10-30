import express, { Router, Request, Response } from "express";
import { signin, signup } from "../controllers/login-out";

export const router: Router = express.Router();

router.post("/signin", signin);

router.post("/signup", signup);
