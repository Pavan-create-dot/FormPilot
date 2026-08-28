import {
  CustomAnswer,
  DetectedField,
  MatchResult,
  Profile
} from "@jobease/shared-types";
import { matchByRule } from "../rules/ruleMatcher";
import { matchBySemantic } from "../semantic/semanticMatcher";
import { FieldClassifier, GeminiLLMClassifier, MockLLMClassifier } from "../classifier/aiClassifier";

export interface FieldEngineConfig {
  classifier?: FieldClassifier;
}

export class FieldEngine {
  private classifier: FieldClassifier;

  constructor(config?: FieldEngineConfig) {
    const apiKey = process.env.GEMINI_API_KEY;
    this.classifier =
      config?.classifier || (apiKey ? new GeminiLLMClassifier(apiKey) : new MockLLMClassifier());
  }

  /**
   * Value extractor from nested profile using path like 'personal.firstName' or 'education.institution'
   */
  public extractProfileValue(profile: Profile, profilePath?: string): any {
    if (!profile || !profilePath) return undefined;
    const parts = profilePath.split(".");
    let current: any = profile;

    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      if (Array.isArray(current)) {
        // Return most recent entry from array if applicable
        current = current[0] ? current[0][part] : undefined;
      } else {
        current = current[part];
      }
    }
    return current;
  }

  /**
   * Main 3-Layer pipeline matching single field
   */
  public async matchField(
    field: DetectedField,
    profile?: Profile,
    customAnswers: CustomAnswer[] = []
  ): Promise<MatchResult> {
    // 1. Layer 1: Rule Matching
    const ruleMatch = matchByRule(field);
    if (ruleMatch && ruleMatch.matched) {
      let value = profile ? this.extractProfileValue(profile, ruleMatch.profileField) : undefined;
      return {
        ...ruleMatch,
        suggestedValue: value !== undefined ? value : ruleMatch.suggestedValue,
        shouldAskUser: ruleMatch.isSensitive || value === undefined || ruleMatch.confidence < 0.90
      };
    }

    // 2. Layer 2: Semantic Matching
    const semanticMatch = matchBySemantic(field, customAnswers);
    if (semanticMatch && semanticMatch.matched) {
      let value = semanticMatch.suggestedValue;
      if (value === undefined && profile && semanticMatch.profileField) {
        value = this.extractProfileValue(profile, semanticMatch.profileField);
      }
      return {
        ...semanticMatch,
        suggestedValue: value,
        shouldAskUser: semanticMatch.isSensitive || value === undefined || semanticMatch.confidence < 0.90
      };
    }

    // 3. Layer 3: AI Fallback Classifier
    const classification = await this.classifier.classifyField(field, profile);
    let aiValue: any = undefined;
    if (classification.requiredProfileField && profile) {
      aiValue = this.extractProfileValue(profile, classification.requiredProfileField);
    }

    return {
      fieldId: field.id,
      matched: classification.confidence >= 0.65,
      profileField: classification.requiredProfileField,
      suggestedValue: aiValue,
      confidence: classification.confidence,
      strategy: "ai",
      explanation: classification.reasoning || `AI classification intent: ${classification.intent}`,
      isSensitive: classification.isSensitive,
      shouldAskUser: classification.shouldAskUser || classification.isSensitive || aiValue === undefined,
      options: field.options,
      originalQuestion: field.label || field.placeholder || field.ariaLabel || field.name
    };
  }

  /**
   * Batch process all detected fields on a webpage
   */
  public async matchFormFields(
    fields: DetectedField[],
    profile?: Profile,
    customAnswers: CustomAnswer[] = []
  ): Promise<MatchResult[]> {
    const results: MatchResult[] = [];
    for (const field of fields) {
      const match = await this.matchField(field, profile, customAnswers);
      results.push(match);
    }
    return results;
  }
}
