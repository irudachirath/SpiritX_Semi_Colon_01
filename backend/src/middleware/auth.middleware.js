"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ error: "Access Denied" });
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid Token" });
    }
};
exports.authMiddleware = authMiddleware;
