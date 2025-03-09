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
exports.AuthService = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
class AuthService {
    // Sign up a new user
    static signup(username, password, confirmPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username || !password || !confirmPassword) {
                throw new Error("All fields are required");
            }
            if (username.length < 8) {
                throw new Error("Username must be at least 8 characters");
            }
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }
            if (!/[A-Z]/.test(password) ||
                !/[a-z]/.test(password) ||
                !/[^A-Za-z0-9]/.test(password) ||
                password.length < 8) {
                throw new Error("Password must have at least 8 characters, one uppercase, one lowercase, and one special character");
            }
            const existingUser = yield userRepository.findOne({ where: { username } });
            if (existingUser) {
                throw new Error("Username already exists");
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newUser = userRepository.create({
                username,
                password: hashedPassword,
            });
            yield userRepository.save(newUser);
            return { message: "User registered successfully" };
        });
    }
    // Login user
    static login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository.findOne({ where: { username } });
            if (!user) {
                throw new Error("Invalid username or password");
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid username or password");
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
            return { message: "Login successful", token, username: user.username };
        });
    }
}
exports.AuthService = AuthService;
