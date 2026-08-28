import { Router, Response } from "express";
import { ApplicationHistoryModel } from "../models/ApplicationHistory";
import { authenticateJWT, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// GET /api/history
router.get("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const history = await ApplicationHistoryModel.find({ userId: req.userId }).sort({ appliedAt: -1 });
    return res.json({ history });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch application history" });
  }
});

// POST /api/history
router.post("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { company, jobTitle, applicationUrl, fieldsFilled, fieldsAsked, unknownFields, status } = req.body;
    const entry = await ApplicationHistoryModel.create({
      userId: req.userId,
      company: company || "Unknown Company",
      jobTitle: jobTitle || "Job Application",
      applicationUrl: applicationUrl || "",
      appliedAt: new Date(),
      fieldsFilled: fieldsFilled || 0,
      fieldsAsked: fieldsAsked || 0,
      unknownFields: unknownFields || 0,
      status: status || "reviewed"
    });
    return res.status(201).json({ historyItem: entry });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to record history" });
  }
});

// PUT /api/history/:id
router.put("/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await ApplicationHistoryModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "History entry not found" });
    return res.json({ historyItem: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
