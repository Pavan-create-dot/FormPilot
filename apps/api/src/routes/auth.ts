import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";
import { ProfileModel } from "../models/Profile";
import { authenticateJWT, AuthenticatedRequest, generateToken } from "../middleware/auth";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: "Valid email and password (min 6 chars) required" });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      email: email.toLowerCase(),
      passwordHash
    });

    // Initialize default profile
    await ProfileModel.create({
      userId: user._id,
      personal: {
        firstName: "",
        lastName: "",
        email: user.email,
        phone: "",
        currentLocation: "",
        address: "",
        country: "",
        links: {}
      },
      education: [],
      experience: [],
      projects: [],
      skills: {
        technicalSkills: [],
        softSkills: [],
        programmingLanguages: [],
        frameworks: [],
        tools: []
      },
      preferences: {
        willingToRelocate: false,
        preferredLocations: [],
        workAuthorizationStatus: "",
        preferredContactMethod: "email"
      }
    });

    const token = generateToken(user._id.toString());
    return res.status(201).json({
      user: {
        id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());
    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Login failed" });
  }
});

// GET /api/auth/me
router.get("/me", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch user" });
  }
});

// POST /api/auth/logout
router.post("/logout", authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ message: "Logged out successfully" });
});

export default router;
