import { QUESTIONS_JSON_SCHEMA, questionsResultSchema } from "./schema.ts";
import type { QuestionsResult } from "./schema.ts";

const INSTRUCTIONS = `You are helping Fieldtrip, an agency that works with nonprofit, public health, and civic clients, prepare clarification questions for an RFP before deciding whether and how to propose.

Read the full RFP text and identify what is ambiguous, missing, or contradictory — things Fieldtrip genuinely needs answered before writing a strong, accurately-scoped proposal. Look specifically for:
- Budget: is a budget or range stated? If not, or if vague, draft a question to surface it.
- Scope boundaries: are deliverables open-ended or could they be read as unlimited in effort/revisions?
- Decision process: is it clear who evaluates, who signs off, and on what timeline?
- Submission logistics: format, page limits, required attachments, and any ambiguity in the deadline or timezone.
- Legal/contractual terms: anything unusual, one-sided, or unclear about IP ownership, payment terms, or liability.
- Anything internally contradictory in the document (e.g. two different deadlines, mismatched scope descriptions).

Draft 5-10 clarification questions. Each should be a single, specific, answerable question phrased the way Fieldtrip would actually send it to the issuing organization — not a category label, not vague. For each, give a one-sentence rationale explaining why the answer matters before proposing.

Do not draft questions about things the RFP already answers clearly. Do not pad the list to hit a count — fewer sharp questions is better than many generic ones.

Respond with ONLY a single JSON object matching the required schema — no markdown, no commentary outside the JSON.`;

function stripMarkdownFence(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return fenced ? fenced[1] : text;
}

export async function generateQuestions(rfpText: string): Promise<QuestionsResult> {
  const apiKey = Deno.env.get("PERPLEXITY_API_KEY");
  if (!apiKey) {
    throw new Error("PERPLEXITY_API_KEY is not set");
  }

  const response = await fetch("https://api.perplexity.ai/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      preset: "fast",
      instructions: INSTRUCTIONS,
      input: `RFP TEXT:\n\n${rfpText}`,
      max_output_tokens: 2000,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "questions_result",
          schema: QUESTIONS_JSON_SCHEMA,
          strict: true,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity request failed (${response.status}): ${await response.text()}`);
  }

  const data = await response.json();
  const messageItem = (data.output ?? []).find(
    (item: { type: string }) => item.type === "message",
  );
  const content = messageItem?.content?.[0]?.text;
  if (!content) {
    throw new Error(`Perplexity response had no message content: ${JSON.stringify(data)}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripMarkdownFence(content));
  } catch {
    throw new Error(`Perplexity response was not valid JSON: ${content}`);
  }

  const result = questionsResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Perplexity response failed schema validation: ${result.error.message}`);
  }

  return result.data;
}
