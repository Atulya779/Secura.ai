export type ModerationCategory = "REAL" | "AI_SAFE" | "DEEPFAKE";

export type ModerationDecision = "ALLOW" | "BLOCK";

export interface VisualModerationModelInfo {
  source: "remote" | "heuristic";
  version: string;
}

export interface VisualModerationResult {
  category: ModerationCategory;
  decision: ModerationDecision;
  confidence: number;
  label: string;
  explanation: string;
  evidence: string[];
  needsReview: boolean;
  reviewReason?: string;
  model: VisualModerationModelInfo;
  analysisType: "image" | "video";
}

export const formatModerationLabel = (category: ModerationCategory) => {
  if (category === "REAL") return "Real photo";
  if (category === "AI_SAFE") return "AI-generated (safe)";
  return "Deepfake / inappropriate";
};

export const decisionFromCategory = (category: ModerationCategory): ModerationDecision => {
  return category === "DEEPFAKE" ? "BLOCK" : "ALLOW";
};
