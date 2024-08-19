"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("./routes/index");
exports.app = (0, express_1.default)();
const port = process.env.PORT || 3000;
exports.app.use("/", index_1.router);
exports.app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
exports.app.use((err, req, res, next) => {
    res.status(err.status | 500);
    res.send({ error: err });
});
