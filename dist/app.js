"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./routes/index");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use("/", index_1.router);
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
