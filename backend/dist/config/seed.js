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
exports.seed = seed;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.TEST_DATABASE_URL,
        },
    },
});
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        const testFolder = yield prisma.folder.upsert({
            where: { id: 1 },
            update: {},
            create: {
                id: 1,
                title: "Test folder",
            },
        });
        const secondFolder = yield prisma.folder.upsert({
            where: { id: 2 },
            update: {},
            create: {
                id: 2,
                title: "Second folder",
            },
        });
        const testUser = yield prisma.user.upsert({
            where: { username: "testing" },
            update: {},
            create: {
                id: 1,
                username: "testing",
                password: yield bcryptjs_1.default.hash("testing", 10),
                files: {
                    create: [{ id: 1, title: "Test file", link: "Link", folderId: 1 }],
                },
            },
        });
    });
}
seed()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
