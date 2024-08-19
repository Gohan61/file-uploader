import express, { Router, Request, Response } from "express";
import { signin } from "../controllers/login-out";

export const router: Router = express.Router();

router.get("/signin", signin);
