import mongoose, { Schema, Document } from "mongoose";
import { Profile as IProfile } from "@jobease/shared-types";

export interface IProfileDocument extends Omit<IProfile, "id">, Document {}

const ProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    personal: {
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      currentLocation: { type: String, default: "" },
      address: { type: String, default: "" },
      country: { type: String, default: "" },
      links: {
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        portfolio: { type: String, default: "" },
        other: [{ type: String }]
      }
    },
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        cgpa: { type: String, default: "" },
        percentage: { type: String, default: "" }
      }
    ],
    experience: [
      {
        company: { type: String, required: true },
        jobTitle: { type: String, required: true },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        description: { type: String, default: "" },
        skillsUsed: [{ type: String }]
      }
    ],
    projects: [
      {
        projectName: { type: String, required: true },
        description: { type: String, default: "" },
        technologies: [{ type: String }],
        githubUrl: { type: String, default: "" },
        liveUrl: { type: String, default: "" }
      }
    ],
    skills: {
      technicalSkills: [{ type: String }],
      softSkills: [{ type: String }],
      programmingLanguages: [{ type: String }],
      frameworks: [{ type: String }],
      tools: [{ type: String }]
    },
    preferences: {
      willingToRelocate: { type: Boolean, default: false },
      preferredLocations: [{ type: String }],
      workAuthorizationStatus: { type: String, default: "" },
      preferredContactMethod: { type: String, default: "email" }
    }
  },
  { timestamps: true }
);

export const ProfileModel = mongoose.model<IProfileDocument>("Profile", ProfileSchema);
