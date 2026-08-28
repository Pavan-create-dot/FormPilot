import { CustomAnswer, DetectedField, MatchResult } from "@jobease/shared-types";
import { extractTokens, normalizeText } from "../normalizer/textNormalizer";
import { FIELD_SYNONYMS, SENSITIVE_KEYWORDS } from "../rules/synonyms";

function calculateOverlapRatio(str1: string, str2: string): number {
  const tokens1 = new Set(extractTokens(str1));
  const tokens2 = new Set(extractTokens(str2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
  const minSize = Math.min(tokens1.size, tokens2.size);

  return intersection.size / minSize;
}

export function matchBySemantic(
  field: DetectedField,
  customAnswers: CustomAnswer[] = []
): MatchResult | null {
  const primaryText = normalizeText(
    field.label || field.ariaLabel || field.placeholder || field.nearbyText || field.name || ""
  );

  if (!primaryText) return null;

  const isSensitive = SENSITIVE_KEYWORDS.some((kw) => primaryText.includes(kw));

  // 1. Check against custom answers stored by user
  let bestCustomAnswer: CustomAnswer | null = null;
  let highestCustomScore = 0;

  for (const ca of customAnswers) {
    const qText = normalizeText(ca.originalQuestion);
    const intentText = normalizeText(ca.normalizedIntent || "");

    const scoreQ = calculateOverlapRatio(primaryText, qText);
    const scoreIntent = intentText ? calculateOverlapRatio(primaryText, intentText) : 0;
    const maxScore = Math.max(scoreQ, scoreIntent);

    if (maxScore > highestCustomScore) {
      highestCustomScore = maxScore;
      bestCustomAnswer = ca;
    }
  }

  if (bestCustomAnswer && highestCustomScore >= 0.33) {
    const confidence = Math.min(0.88, Number((0.68 + highestCustomScore * 0.20).toFixed(2)));
    return {
      fieldId: field.id,
      matched: true,
      suggestedValue: bestCustomAnswer.answer,
      confidence,
      strategy: "custom-answer",
      explanation: `Semantically matched custom answer: "${bestCustomAnswer.originalQuestion}" (score: ${highestCustomScore.toFixed(2)})`,
      isSensitive,
      shouldAskUser: isSensitive || confidence < 0.90,
      options: bestCustomAnswer.options || field.options,
      originalQuestion: field.label || field.placeholder || field.ariaLabel || primaryText
    };
  }

  // 2. Check against known profile fields using keyword overlap
  let bestProfileField: string | null = null;
  let highestProfileScore = 0;

  for (const [key, def] of Object.entries(FIELD_SYNONYMS)) {
    for (const syn of def.synonyms) {
      const score = calculateOverlapRatio(primaryText, syn);
      if (score > highestProfileScore) {
        highestProfileScore = score;
        bestProfileField = def.profileKey;
      }
    }
  }

  if (bestProfileField && highestProfileScore >= 0.33) {
    const confidence = Math.min(0.85, Number((0.65 + highestProfileScore * 0.20).toFixed(2)));
    return {
      fieldId: field.id,
      matched: true,
      profileField: bestProfileField,
      confidence,
      strategy: "semantic",
      explanation: `Semantically matched profile key '${bestProfileField}' (score: ${highestProfileScore.toFixed(2)})`,
      isSensitive,
      shouldAskUser: isSensitive || confidence < 0.90,
      originalQuestion: field.label || field.placeholder || field.ariaLabel || primaryText
    };
  }

  return null;
}
