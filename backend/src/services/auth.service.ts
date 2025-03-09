import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export class AuthService {
  // Sign up a new user
  static async signup(
    username: string,
    password: string,
    confirmPassword: string
  ) {
    if (!username || !password || !confirmPassword) {
      throw new Error("All fields are required");
    }

    if (username.length < 8) {
      throw new Error("Username must be at least 8 characters");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password) ||
      password.length < 8
    ) {
      throw new Error(
        "Password must have at least 8 characters, one uppercase, one lowercase, and one special character"
      );
    }

    const existingUser = await userRepository.findOne({ where: { username } });

    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      username,
      password: hashedPassword,
    });
    await userRepository.save(newUser);

    return { message: "User registered successfully" };
  }

  // Login user
  static async login(username: string, password: string) {
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { message: "Login successful", token, username: user.username };
  }
}
