import { Router, Response } from "express";
import { CustomAnswerModel } from "../models/CustomAnswer";
import { authenticateJWT, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// GET /api/custom-answers
router.get("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customAnswers = await CustomAnswerModel.find({ userId: req.userId }).sort({ updatedAt: -1 });
    return res.json({ customAnswers });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch custom answers" });
  }
});

// POST /api/custom-answers
router.post("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { originalQuestion, normalizedIntent, answer, fieldType, options } = req.body;
    if (!originalQuestion || answer === undefined) {
      return res.status(400).json({ error: "originalQuestion and answer are required" });
    }

    const newAnswer = await CustomAnswerModel.create({
      userId: req.userId,
      originalQuestion,
      normalizedIntent: normalizedIntent || originalQuestion.toLowerCase(),
      answer,
      fieldType: fieldType || "text",
      options: options || [],
      lastUsedAt: new Date()
    });

    return res.status(201).json({ customAnswer: newAnswer });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to create custom answer" });
  }
});

// PUT /api/custom-answers/:id
router.put("/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await CustomAnswerModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body, lastUsedAt: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Custom answer not found" });
    return res.json({ customAnswer: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to update custom answer" });
  }
});

// DELETE /api/custom-answers/:id
router.delete("/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = await CustomAnswerModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!deleted) return res.status(404).json({ error: "Custom answer not found" });
    return res.json({ message: "Custom answer deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to delete custom answer" });
  }
});

export default router;
