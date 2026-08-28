import { describe, expect, it } from "vitest";
import { FieldEngine } from "../src/matcher/fieldEngine";
import { DetectedField, Profile, CustomAnswer } from "@jobease/shared-types";

describe("FieldEngine Pipeline Tests", () => {
  const engine = new FieldEngine();

  const mockProfile: Profile = {
    id: "p1",
    userId: "u1",
    personal: {
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul@example.com",
      phone: "+919876543210",
      currentLocation: "Bangalore",
      address: "123 Main St",
      country: "India",
      links: {
        linkedin: "https://linkedin.com/in/rahulsharma",
        github: "https://github.com/rahulsharma"
      }
    },
    education: [
      {
        id: "e1",
        institution: "VIT-AP University",
        degree: "B.Tech",
        fieldOfStudy: "Computer Science",
        startDate: "2020",
        endDate: "2024",
        cgpa: "8.9"
      }
    ],
    experience: [],
    projects: [],
    skills: {
      technicalSkills: ["React", "TypeScript", "Node.js"],
      softSkills: ["Communication"],
      programmingLanguages: ["TypeScript", "JavaScript"],
      frameworks: ["React", "Express"],
      tools: ["Git", "VSCode"]
    },
    preferences: {
      willingToRelocate: true,
      preferredLocations: ["Bangalore", "Hyderabad"],
      workAuthorizationStatus: "Authorized to work",
      preferredContactMethod: "email"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it("Example 1: Should match 'Given Name' using deterministic rule strategy", async () => {
    const field: DetectedField = {
      id: "f1",
      elementType: "input",
      label: "Given Name",
      required: true
    };

    const match = await engine.matchField(field, mockProfile);
    expect(match.matched).toBe(true);
    expect(match.strategy).toBe("rule");
    expect(match.profileField).toBe("personal.firstName");
    expect(match.suggestedValue).toBe("Rahul");
    expect(match.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it("Example 2: Should match 'What is your primary channel for communication?' using semantic strategy", async () => {
    const field: DetectedField = {
      id: "f2",
      elementType: "select",
      label: "What is your primary channel for communication?",
      required: false
    };

    const match = await engine.matchField(field, mockProfile);
    expect(match.matched).toBe(true);
    expect(match.strategy).toBe("semantic");
    expect(match.profileField).toBe("preferences.preferredContactMethod");
    expect(match.suggestedValue).toBe("email");
  });

  it("Should match custom answer semantically for unknown question", async () => {
    const field: DetectedField = {
      id: "f3",
      elementType: "radio",
      label: "Are you open to business travel?",
      options: ["Yes", "No"],
      required: false
    };

    const customAnswers: CustomAnswer[] = [
      {
        id: "ca1",
        userId: "u1",
        originalQuestion: "Are you willing to travel for this position?",
        answer: "Yes",
        fieldType: "radio",
        options: ["Yes", "No"],
        createdAt: new Date()
      }
    ];

    const match = await engine.matchField(field, mockProfile, customAnswers);
    expect(match.matched).toBe(true);
    expect(match.strategy).toBe("custom-answer");
    expect(match.suggestedValue).toBe("Yes");
  });

  it("Should handle sensitive field safety rules for work authorization", async () => {
    const field: DetectedField = {
      id: "f4",
      elementType: "select",
      label: "Do you require visa sponsorship to work?",
      required: true
    };

    const match = await engine.matchField(field, mockProfile);
    expect(match.isSensitive).toBe(true);
    expect(match.shouldAskUser).toBe(true);
  });
});
