import { z } from "zod";

export const ORG_INTELLIGENCE_SIGNALS = [
  "990 on file?",
  "Annual revenue (most recent 990)",
  "Number of paid employees",
  "Point of contact: paid or volunteer?",
  "LinkedIn presence",
  "Website currency",
  "Candid/GuideStar rating",
  "Recent news or notable events",
] as const;

export const RUBRIC_DIMENSIONS = [
  "Mission Alignment",
  "Budget & Value Health",
  "Scope & Boundaries",
  "Timeline & Capacity",
] as const;

export const aiReviewResultSchema = z.object({
  recommendation: z.enum(["Go", "Conditional Go", "No-Go"]),
  total_score: z.number().min(0).max(12),
  executive_summary: z.string().min(1),
  org_intelligence: z
    .array(
      z.object({
        signal: z.enum(ORG_INTELLIGENCE_SIGNALS),
        finding: z.string().min(1),
        implication: z.string().min(1),
      }),
    )
    .length(8),
  rubric: z
    .array(
      z.object({
        dimension: z.enum(RUBRIC_DIMENSIONS),
        score: z.number().min(0).max(3),
        rationale: z.string().min(1),
      }),
    )
    .length(4),
  risks: z
    .array(
      z.object({
        risk: z.string().min(1),
        guardrail: z.string().min(1),
      }),
    )
    .min(1),
  next_steps: z.array(z.string().min(1)).min(1),
});

export type AiReviewResult = z.infer<typeof aiReviewResultSchema>;

// JSON Schema mirror of the above, for Perplexity's response_format.
// Keep these two in sync by hand — Zod doesn't have a zero-dependency
// JSON Schema exporter available in this Deno runtime.
export const AI_REVIEW_JSON_SCHEMA = {
  type: "object",
  properties: {
    recommendation: { type: "string", enum: ["Go", "Conditional Go", "No-Go"] },
    total_score: { type: "number" },
    executive_summary: { type: "string" },
    org_intelligence: {
      type: "array",
      minItems: 8,
      maxItems: 8,
      items: {
        type: "object",
        properties: {
          signal: {
            type: "string",
            enum: ORG_INTELLIGENCE_SIGNALS,
            description: "Must be exactly one of the 8 fixed signal labels, verbatim.",
          },
          finding: {
            type: "string",
            description: "What you found for this signal — the actual data point, never the label itself.",
          },
          implication: { type: "string" },
        },
        required: ["signal", "finding", "implication"],
      },
    },
    rubric: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        properties: {
          dimension: {
            type: "string",
            enum: RUBRIC_DIMENSIONS,
            description: "Must be exactly one of the 4 fixed dimension names, verbatim.",
          },
          score: { type: "number" },
          rationale: { type: "string" },
        },
        required: ["dimension", "score", "rationale"],
      },
    },
    risks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          risk: { type: "string" },
          guardrail: { type: "string" },
        },
        required: ["risk", "guardrail"],
      },
    },
    next_steps: { type: "array", items: { type: "string" } },
  },
  required: [
    "recommendation",
    "total_score",
    "executive_summary",
    "org_intelligence",
    "rubric",
    "risks",
    "next_steps",
  ],
};
