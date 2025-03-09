"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
router.post("/signup", (req, res) => auth_controller_1.AuthController.signup(req, res));
router.post("/login", (req, res) => auth_controller_1.AuthController.login(req, res));
exports.default = router;
