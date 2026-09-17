import { AI_REVIEW_JSON_SCHEMA, aiReviewResultSchema } from "./schema.ts";
import type { AiReviewResult } from "./schema.ts";

const INSTRUCTIONS = `You are an RFP evaluator for Fieldtrip, an agency that works with nonprofit, public health, and civic clients on branding, campaigns, and web projects. Given the full text of an RFP and the organization's name, do the following:

Step 1: Ingest and analyze the RFP. Extract issuing organization, client segment, project type, stated budget, proposal deadline, project timeline, and key deliverables.

Step 2: Research the issuing organization using web search. At minimum look for: IRS Form 990 data (revenue, employee count, leadership compensation, e.g. via ProPublica Nonprofit Explorer), LinkedIn presence and activity, organization website currency and brand investment history, Candid/GuideStar transparency rating, and recent news coverage, leadership changes, or grant awards. Your org_intelligence findings must directly inform your rubric scores.

Step 3: Score the opportunity 0-3 on each of these four dimensions, informed by your org research:
- Mission & Segment Alignment
- Budget & Value Health
- Scope & Relationship Boundaries
- Timeline & Capacity Feasibility
Sum them for a total score out of 12.

Step 4: Identify strategic risks. Specifically look for:
- The "Do Everything" Trap: vague scope suggesting the client expects Fieldtrip to solve internal organizational issues with marketing.
- The "Perform Effort" Trap: excessive meetings, administrative overhead, or free spec work required to "prove" value.
- The "Compressed Timeline" Trap: deadlines that force rushing or burnout.
- The "Volunteer Client" Trap: a point of contact with no authority, no marketing background, and no capacity for timely feedback.
For each risk found, state a concrete guardrail Fieldtrip should hold.

Step 5: Recommend Go, Conditional Go, or No-Go, with a direct 2-3 sentence executive summary. If Conditional Go, state the exact conditions in the summary.

Respond with ONLY a single JSON object matching the required schema — no markdown, no commentary outside the JSON. The org_intelligence array must have exactly these 8 signals in this order: "990 on file?", "Annual revenue (most recent 990)", "Number of paid employees", "Point of contact: paid or volunteer?", "LinkedIn presence", "Website currency", "Candid/GuideStar rating", "Recent news or notable events". The rubric array must have exactly these 4 dimensions in this order: "Mission Alignment", "Budget & Value Health", "Scope & Boundaries", "Timeline & Capacity". If you cannot find a piece of information after searching, say so plainly in that field (e.g. "Not found") rather than guessing.`;

function stripMarkdownFence(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return fenced ? fenced[1] : text;
}

export async function evaluateRfp(
  rfpText: string,
  organizationName: string,
): Promise<AiReviewResult> {
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
      preset: "medium",
      instructions: INSTRUCTIONS,
      input: `Organization name (as entered by the pursuit team): ${organizationName}\n\nRFP TEXT:\n\n${rfpText}`,
      max_output_tokens: 4000,
      tools: [{ type: "web_search", max_results: 10 }],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ai_review_result",
          schema: AI_REVIEW_JSON_SCHEMA,
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

  const result = aiReviewResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Perplexity response failed schema validation: ${result.error.message}`);
  }

  return result.data;
}
