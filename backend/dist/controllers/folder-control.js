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
exports.updateFolder = exports.deleteFolder = exports.getFolder = exports.newFolder = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.newFolder = [
    (0, express_validator_1.body)("title", "Title cannot be empty").trim().isLength({ min: 1 }),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const body = req.body;
        const fileName = yield prisma.folder.findUnique({
            where: {
                title: body.title,
            },
        });
        if (!errors.isEmpty()) {
            res.status(500).json({ errors: errors.array() });
        }
        else if (fileName) {
            res.status(500).json({ message: "Folder title already exists" });
        }
        else {
            yield prisma.folder.create({
                data: {
                    title: body.title,
                },
            });
            res.status(200).json({ message: "Folder created" });
        }
    })),
];
exports.getFolder = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const folder = yield prisma.folder.findMany({
        where: {
            title: body.title,
        },
        include: {
            files: true,
        },
    });
    if (!folder.length) {
        return res.status(404).json({ error: "Could not find folder" });
    }
    else {
        return res.status(200).json({ folder: folder });
    }
}));
exports.deleteFolder = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fileTitle = req.params.title;
    const folder = yield prisma.folder.findUnique({
        where: {
            title: fileTitle,
        },
    });
    if (!folder) {
        return res.status(404).json({ error: "Could not find folder" });
    }
    else {
        yield prisma.folder.delete({
            where: {
                title: fileTitle,
            },
        });
        return res.status(200).json({ message: "Folder deleted" });
    }
}));
exports.updateFolder = [
    (0, express_validator_1.body)("newTitle", "Title cannot be empty").trim().isLength({ min: 1 }),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const body = req.body;
        const title = req.params.title;
        if (!errors.isEmpty()) {
            res.status(500).json({ errors: errors.array() });
        }
        const file = yield prisma.folder.findUnique({
            where: {
                title: body.newTitle,
                NOT: {
                    id: Number(body.id),
                },
            },
        });
        if (file) {
            return res.status(500).json({ message: "Folder name already exists" });
        }
        else {
            yield prisma.folder.update({
                where: {
                    id: Number(body.id),
                },
                data: {
                    title: body.newTitle,
                },
            });
            return res.status(200).json({ message: "Folder name changed" });
        }
    })),
];
