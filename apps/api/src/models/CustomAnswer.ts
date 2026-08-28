import mongoose, { Schema, Document } from "mongoose";
import { CustomAnswer as ICustomAnswer } from "@jobease/shared-types";

export interface ICustomAnswerDocument extends Omit<ICustomAnswer, "id">, Document {}

const CustomAnswerSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    originalQuestion: { type: String, required: true },
    normalizedIntent: { type: String },
    answer: { type: Schema.Types.Mixed, required: true },
    fieldType: {
      type: String,
      enum: ["text", "textarea", "select", "radio", "checkbox", "boolean"],
      default: "text"
    },
    options: [{ type: String }],
    lastUsedAt: { type: Date }
  },
  { timestamps: true }
);

export const CustomAnswerModel = mongoose.model<ICustomAnswerDocument>(
  "CustomAnswer",
  CustomAnswerSchema
);
