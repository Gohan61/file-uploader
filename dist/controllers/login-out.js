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
exports.signin = exports.signup = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
exports.signup = [
    (0, express_validator_1.body)("username", "Username cannot be empty").trim().isLength({ min: 1 }),
    (0, express_validator_1.body)("name").trim().optional(),
    (0, express_validator_1.body)("password", "Password cannot be empty").trim().isLength({ min: 1 }),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        try {
            bcryptjs_1.default.hash(req.body.password, 10, (err, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield prisma.user.create({
                    data: {
                        username: req.body.username,
                        name: req.body.name,
                        password: hashedPassword,
                    },
                });
                if (!errors.isEmpty()) {
                    res.status(500).json({ errors: errors.array(), user: user });
                }
                else {
                    res.status(200).json({ message: "User saved" });
                }
            }));
        }
        catch (err) {
            return next(err);
        }
    })),
];
exports.signin = [
    (0, express_validator_1.body)("username").trim().isLength({ min: 1 }),
    (0, express_validator_1.body)("password").trim().isLength({ min: 1 }),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(404)
                .json({ message: "Could not login user", errors: errors.array() });
        }
        passport_1.default.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                res.status(404).json({ error: "User not found", user });
            }
            else {
                req.login(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                });
                return res.status(200);
            }
        })(req, res, next);
    })),
];
