import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { signToken } from "../utils/token.js";

const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(6).max(64)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(64)
});

export async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash
    });

    return res.status(201).json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const matches = await bcrypt.compare(data.password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    return next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("_id name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    return next(err);
  }
}
