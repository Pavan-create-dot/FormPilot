import { DetectedField, MatchResult } from "@jobease/shared-types";
import { FIELD_SYNONYMS, SENSITIVE_KEYWORDS } from "./synonyms";
import { normalizeText } from "../normalizer/textNormalizer";

export function matchByRule(field: DetectedField): MatchResult | null {
  const contexts = [
    field.label,
    field.ariaLabel,
    field.placeholder,
    field.name,
    field.domId,
    field.nearbyText
  ].map((t) => normalizeText(t)).filter(Boolean);

  if (contexts.length === 0) return null;

  for (const [key, def] of Object.entries(FIELD_SYNONYMS)) {
    for (const synonym of def.synonyms) {
      const normalizedSynonym = normalizeText(synonym);
      
      for (const ctx of contexts) {
        // Exact match or clean boundary match
        if (
          ctx === normalizedSynonym ||
          ctx.includes(normalizedSynonym) ||
          normalizedSynonym.includes(ctx)
        ) {
          const isSensitive =
            def.isSensitive ||
            SENSITIVE_KEYWORDS.some((kw) => ctx.includes(kw) || normalizedSynonym.includes(kw));

          return {
            fieldId: field.id,
            matched: true,
            profileField: def.profileKey,
            confidence: isSensitive ? 0.85 : 0.95, // High confidence rule match
            strategy: "rule",
            explanation: `Matched rule synonym '${synonym}' against context '${ctx}'`,
            isSensitive,
            shouldAskUser: isSensitive,
            originalQuestion: field.label || field.placeholder || field.ariaLabel || field.name
          };
        }
      }
    }
  }

  return null;
}
