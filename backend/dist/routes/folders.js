"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.folderRouter = void 0;
const express_1 = __importDefault(require("express"));
const folder_control_1 = require("../controllers/folder-control");
exports.folderRouter = express_1.default.Router();
exports.folderRouter.post("/new", folder_control_1.newFolder);
exports.folderRouter.get("/:title", folder_control_1.getFolder);
exports.folderRouter.delete("/:title", folder_control_1.deleteFolder);
exports.folderRouter.put("/:title", folder_control_1.updateFolder);
