import express, { Router, Request, Response } from "express";
import { logout, signin, signup } from "../controllers/login-out";

export const router: Router = express.Router();

router.post("/signin", signin);

router.post("/signup", signup);

router.get("/logout", logout);
