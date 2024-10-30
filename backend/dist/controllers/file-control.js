"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFile = exports.getFile = exports.deleteFile = exports.newFile = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.newFile = [
    (0, express_validator_1.body)("title").trim().isLength({ min: 1 }),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let file;
        const body = req.body;
        const user = req.user;
        const uploadTimeSeconds = Math.round(Date.now() - Number(body.sendTime) / 1000);
        const sizeInMB = (Number((_a = req.file) === null || _a === void 0 ? void 0 : _a.size) / (1024 * 1024)).toFixed(2) + " MB";
        if (req.file && user) {
            file = yield prisma.files.create({
                data: {
                    title: req.file.filename,
                    ownerId: Number(user.id),
                    folderId: Number(body.folderId),
                    size: sizeInMB,
                    uploadTime: uploadTimeSeconds,
                    link: "test",
                },
            });
            if (file) {
                return res.status(200).json({ message: "File uploaded" });
            }
        }
        else {
            return res.status(500).json({ error: "Something went wrong" });
        }
    })),
];
exports.deleteFile = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = Number(req.params.file);
    const file = yield prisma.files.findUnique({
        where: {
            id: fileId,
        },
    });
    if (!file) {
        return res.status(500).json({ error: "File not found" });
    }
    yield prisma.files.delete({
        where: {
            id: file.id,
        },
    });
    return res.status(200).json({ message: "File deleted" });
}));
exports.getFile = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = Number(req.params.fileId);
    const file = yield prisma.files.findUnique({
        where: {
            id: fileId,
        },
    });
    if (!file) {
        return res.status(404).json({ error: "File not found" });
    }
    else {
        return res.status(200).json({ file: file });
    }
}));
exports.updateFile = [
    (0, express_validator_1.body)("newTitle", "Title cannot be empty").trim().isLength({ min: 1 }),
    (0, express_validator_1.body)("newFolder", "Folder name cannot be empty").trim().isLength({ min: 1 }),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const fileId = Number(req.params.fileId);
        const file = yield prisma.files.findUnique({
            where: {
                id: fileId,
            },
        });
        const newFolder = yield prisma.folder.findUnique({
            where: {
                title: req.body.newFolder,
            },
        });
        if (!errors.isEmpty()) {
            return res.status(500).json({ errors: errors.array() });
        }
        else if (!file || !newFolder) {
            return res.status(500).json({ error: "Folder or file does not exist" });
        }
        else {
            const updateFile = yield prisma.files.update({
                where: {
                    id: fileId,
                },
                data: {
                    title: req.body.newTitle,
                    folderId: newFolder.id,
                },
            });
            return res.status(200).json({ message: "File updated" });
        }
    })),
];
