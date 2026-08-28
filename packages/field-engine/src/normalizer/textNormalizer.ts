export function normalizeText(text?: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractTokens(text?: string): string[] {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  const stopWords = new Set([
    "please", "enter", "your", "provide", "the", "a", "an", "for", "of", "in", "to", "candidate", "applicant"
  ]);
  return normalized
    .split(" ")
    .filter((word) => word.length > 1 && !stopWords.has(word));
}

export function calculateJaccardSimilarity(str1: string, str2: string): number {
  const tokens1 = new Set(extractTokens(str1));
  const tokens2 = new Set(extractTokens(str2));
  
  if (tokens1.size === 0 || tokens2.size === 0) return 0;
  
  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);
  
  return intersection.size / union.size;
}
