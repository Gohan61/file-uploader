"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = middleWare;
const files_1 = require("../routes/files");
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
require("../config/passport");
const routes_1 = require("../routes");
const express_session_1 = __importDefault(require("express-session"));
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const passport_1 = __importDefault(require("passport"));
const folders_1 = require("../routes/folders");
function middleWare(app) {
    app.use(express_1.default.json({ limit: "10mb" }));
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, express_session_1.default)({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // ms
        },
        secret: process.env.secret,
        resave: true,
        saveUninitialized: true,
        store: new prisma_session_store_1.PrismaSessionStore(new client_1.PrismaClient(), {
            checkPeriod: 2 * 60 * 1000, //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    }));
    app.use(passport_1.default.session());
    app.use("/", routes_1.router);
    app.use("/files", passport_1.default.authenticate("session"), files_1.fileRouter);
    app.use("/folders", passport_1.default.authenticate("session"), folders_1.folderRouter);
}
