"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileRouter = void 0;
const express_1 = __importDefault(require("express"));
const file_control_1 = require("../controllers/file-control");
const upload_1 = require("../config/upload");
exports.fileRouter = express_1.default.Router();
exports.fileRouter.post("/newfile", upload_1.upload.single("text"), file_control_1.newFile);
exports.fileRouter.delete("/:file", file_control_1.deleteFile);
exports.fileRouter.get("/:fileId", file_control_1.getFile);
exports.fileRouter.put("/:fileId", file_control_1.updateFile);
