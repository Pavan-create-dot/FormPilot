import { Router, Response } from "express";
import { FieldEngine } from "@jobease/field-engine";
import { ProfileModel } from "../models/Profile";
import { CustomAnswerModel } from "../models/CustomAnswer";
import { authenticateJWT, AuthenticatedRequest } from "../middleware/auth";
import { calculateProfileCompleteness } from "./profile";

const router = Router();
const engine = new FieldEngine();

// POST /api/fields/match
router.post("/match", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fields } = req.body;
    if (!Array.isArray(fields)) {
      return res.status(400).json({ error: "fields array is required" });
    }

    const profileDoc = await ProfileModel.findOne({ userId: req.userId });
    const profile = profileDoc ? (profileDoc.toObject() as any) : undefined;
    if (profile) profile.id = profile._id.toString();

    const customAnswerDocs = await CustomAnswerModel.find({ userId: req.userId });
    const customAnswers = customAnswerDocs.map((doc) => {
      const obj = doc.toObject() as any;
      obj.id = obj._id.toString();
      return obj;
    });

    const matches = await engine.matchFormFields(fields, profile, customAnswers);
    const completeness = calculateProfileCompleteness(profile);

    return res.json({
      matches,
      profileCompleteness: completeness
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to process field matching" });
  }
});

// POST /api/fields/classify
router.post("/classify", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { field } = req.body;
    if (!field) return res.status(400).json({ error: "field object is required" });

    const profileDoc = await ProfileModel.findOne({ userId: req.userId });
    const profile = profileDoc ? (profileDoc.toObject() as any) : undefined;

    const customAnswerDocs = await CustomAnswerModel.find({ userId: req.userId });
    const customAnswers = customAnswerDocs.map((doc) => {
      const obj = doc.toObject() as any;
      obj.id = obj._id.toString();
      return obj;
    });

    const match = await engine.matchField(field, profile, customAnswers);
    return res.json({ match });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Classification failed" });
  }
});

export default router;
