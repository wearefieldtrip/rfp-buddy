import { z } from "zod";

export const questionsResultSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(1),
        rationale: z.string().min(1),
      }),
    )
    .min(1)
    .max(15),
});

export type QuestionsResult = z.infer<typeof questionsResultSchema>;

export const QUESTIONS_JSON_SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The exact clarification question to ask the issuing organization.",
          },
          rationale: {
            type: "string",
            description: "One sentence on why this matters before proposing.",
          },
        },
        required: ["question", "rationale"],
      },
    },
  },
  required: ["questions"],
};
