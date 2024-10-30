"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("./routes/index");
const files_1 = require("./routes/files");
const folders_1 = require("./routes/folders");
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const client_1 = require("@prisma/client");
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
require("./config/passport");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json({ limit: "10mb" }));
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, express_session_1.default)({
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
exports.app.use(passport_1.default.session());
exports.app.use("/", index_1.router);
exports.app.use("/files", passport_1.default.authenticate("session"), files_1.fileRouter);
exports.app.use("/folders", passport_1.default.authenticate("session"), folders_1.folderRouter);
exports.app.use((err, req, res, next) => {
    res.status(err.status | 500);
    res.send({ error: err });
});
const port = process.env.PORT || 3000;
exports.app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
