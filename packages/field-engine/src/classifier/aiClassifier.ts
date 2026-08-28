import { DetectedField, FieldClassification } from "@jobease/shared-types";
import { SENSITIVE_KEYWORDS } from "../rules/synonyms";
import { normalizeText } from "../normalizer/textNormalizer";

export interface FieldClassifier {
  classifyField(
    field: DetectedField,
    availableProfileSchema?: unknown
  ): Promise<FieldClassification>;
}

export class MockLLMClassifier implements FieldClassifier {
  async classifyField(
    field: DetectedField,
    _availableProfileSchema?: unknown
  ): Promise<FieldClassification> {
    const questionText = normalizeText(
      field.label || field.ariaLabel || field.placeholder || field.nearbyText || field.name || ""
    );

    const isSensitive = SENSITIVE_KEYWORDS.some((kw) => questionText.includes(kw));

    if (questionText.includes("relocate") || questionText.includes("relocation")) {
      return {
        intent: "relocation_preference",
        confidence: 0.92,
        requiredProfileField: "preferences.willingToRelocate",
        isSensitive: false,
        shouldAskUser: false,
        reasoning: "Question asks about willingness to relocate for the job."
      };
    }

    if (questionText.includes("travel") || questionText.includes("business travel")) {
      return {
        intent: "travel_willingness",
        confidence: 0.80,
        isSensitive: false,
        shouldAskUser: true,
        reasoning: "Question asks about business travel availability."
      };
    }

    if (questionText.includes("authorized") || questionText.includes("sponsorship")) {
      return {
        intent: "work_authorization",
        confidence: 0.95,
        requiredProfileField: "preferences.workAuthorizationStatus",
        isSensitive: true,
        shouldAskUser: true,
        reasoning: "Sensitive legal question regarding work authorization."
      };
    }

    return {
      intent: questionText || "unknown_field",
      confidence: 0.40,
      isSensitive,
      shouldAskUser: true,
      reasoning: "Field intent could not be determined automatically."
    };
  }
}

export class GeminiLLMClassifier implements FieldClassifier {
  private apiKey: string;
  private fallback: MockLLMClassifier;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || "";
    this.fallback = new MockLLMClassifier();
  }

  async classifyField(
    field: DetectedField,
    availableProfileSchema?: unknown
  ): Promise<FieldClassification> {
    if (!this.apiKey) {
      return this.fallback.classifyField(field, availableProfileSchema);
    }

    const questionText =
      field.label || field.ariaLabel || field.placeholder || field.nearbyText || field.name || "";

    const prompt = `You are an AI assistant analyzing a job application form field.
Field Details:
- Question / Label: "${questionText}"
- Element Type: "${field.elementType}"
- Options: ${field.options ? JSON.stringify(field.options) : "None"}

Analyze the intent and return ONLY a raw valid JSON object with the following schema (no markdown blocks):
{
  "intent": "string (e.g. relocation_preference, work_authorization, travel_willingness, etc)",
  "confidence": number (between 0.0 and 1.0),
  "requiredProfileField": "string or null (e.g. personal.firstName, preferences.willingToRelocate, preferences.workAuthorizationStatus)",
  "isSensitive": boolean (true if regarding work authorization, legal status, disability, race, gender),
  "shouldAskUser": boolean,
  "reasoning": "string"
}`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        return this.fallback.classifyField(field, availableProfileSchema);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const cleanJsonStr = responseText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanJsonStr);
      return {
        intent: parsed.intent || "unknown",
        confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
        requiredProfileField: parsed.requiredProfileField || undefined,
        isSensitive: Boolean(parsed.isSensitive),
        shouldAskUser: Boolean(parsed.shouldAskUser),
        reasoning: parsed.reasoning || "Classified via Google Gemini AI"
      };
    } catch (err) {
      console.warn("Gemini AI classification fallback triggered:", err);
      return this.fallback.classifyField(field, availableProfileSchema);
    }
  }
}
