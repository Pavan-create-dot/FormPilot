import { Router, Response } from "express";
import { ProfileModel } from "../models/Profile";
import { authenticateJWT, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// Helper to calculate profile completeness score (0 - 100%)
export function calculateProfileCompleteness(profile: any): number {
  if (!profile) return 0;
  let score = 0;
  const total = 7;

  if (profile.personal?.firstName && profile.personal?.lastName && profile.personal?.phone) score += 1;
  if (profile.personal?.links?.linkedin || profile.personal?.links?.github) score += 1;
  if (profile.education && profile.education.length > 0) score += 1;
  if (profile.experience && profile.experience.length > 0) score += 1;
  if (profile.projects && profile.projects.length > 0) score += 1;
  if (profile.skills && (profile.skills.technicalSkills?.length > 0 || profile.skills.programmingLanguages?.length > 0)) score += 1;
  if (profile.preferences?.workAuthorizationStatus || profile.preferences?.preferredLocations?.length > 0) score += 1;

  return Math.round((score / total) * 100);
}

// GET /api/profile
router.get("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    let profile = await ProfileModel.findOne({ userId: req.userId });
    if (!profile) {
      profile = await ProfileModel.create({ userId: req.userId });
    }
    const completeness = calculateProfileCompleteness(profile);
    return res.json({ profile, completeness });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch profile" });
  }
});

// PUT /api/profile
router.put("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { userId: req.userId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    const completeness = calculateProfileCompleteness(updatedProfile);
    return res.json({ profile: updatedProfile, completeness });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to update profile" });
  }
});

// Education CRUD
router.post("/education", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    profile.education.push(req.body);
    await profile.save();
    return res.status(201).json({ profile, education: profile.education });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/education/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const eduItem = (profile.education as any).id(req.params.id);
    if (!eduItem) return res.status(404).json({ error: "Education entry not found" });

    Object.assign(eduItem, req.body);
    await profile.save();
    return res.json({ profile, education: profile.education });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/education/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    profile.education = profile.education.filter((item: any) => item._id.toString() !== req.params.id);
    await profile.save();
    return res.json({ profile, education: profile.education });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Experience CRUD
router.post("/experience", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    profile.experience.push(req.body);
    await profile.save();
    return res.status(201).json({ profile, experience: profile.experience });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/experience/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const expItem = (profile.experience as any).id(req.params.id);
    if (!expItem) return res.status(404).json({ error: "Experience entry not found" });

    Object.assign(expItem, req.body);
    await profile.save();
    return res.json({ profile, experience: profile.experience });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/experience/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    profile.experience = profile.experience.filter((item: any) => item._id.toString() !== req.params.id);
    await profile.save();
    return res.json({ profile, experience: profile.experience });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Projects CRUD
router.post("/projects", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    profile.projects.push(req.body);
    await profile.save();
    return res.status(201).json({ profile, projects: profile.projects });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/projects/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const projItem = (profile.projects as any).id(req.params.id);
    if (!projItem) return res.status(404).json({ error: "Project entry not found" });

    Object.assign(projItem, req.body);
    await profile.save();
    return res.json({ profile, projects: profile.projects });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/projects/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    profile.projects = profile.projects.filter((item: any) => item._id.toString() !== req.params.id);
    await profile.save();
    return res.json({ profile, projects: profile.projects });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Skills
router.get("/skills", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.userId });
    return res.json({ skills: profile?.skills || {} });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/skills", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    profile.skills = { ...profile.skills, ...req.body };
    await profile.save();
    return res.json({ skills: profile.skills });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
