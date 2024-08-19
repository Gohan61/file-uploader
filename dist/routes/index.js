"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const login_out_1 = require("../controllers/login-out");
exports.router = express_1.default.Router();
exports.router.get("/signin", login_out_1.signin);
