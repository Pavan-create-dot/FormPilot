import mongoose, { Schema, Document } from "mongoose";
import { ApplicationHistory as IApplicationHistory } from "@jobease/shared-types";

export interface IApplicationHistoryDocument
  extends Omit<IApplicationHistory, "id">,
    Document {}

const ApplicationHistorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    applicationUrl: { type: String, default: "" },
    appliedAt: { type: Date, default: Date.now },
    fieldsFilled: { type: Number, default: 0 },
    fieldsAsked: { type: Number, default: 0 },
    unknownFields: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "reviewed", "submitted"],
      default: "reviewed"
    }
  },
  { timestamps: true }
);

export const ApplicationHistoryModel = mongoose.model<IApplicationHistoryDocument>(
  "ApplicationHistory",
  ApplicationHistorySchema
);
