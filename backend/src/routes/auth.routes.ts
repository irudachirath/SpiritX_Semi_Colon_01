import express from "express";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", (req, res) => AuthController.signup(req, res));
router.post("/login", (req, res) => AuthController.login(req, res));

export default router;
