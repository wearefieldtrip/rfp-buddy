// Setup type definitions for built-in Supabase Runtime APIs (EdgeRuntime.waitUntil, etc.)
import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Duplicated (not imported) from src/features/rfps/dummyAiReview.ts: the
// frontend and this Deno function are separate runtimes with separate
// dependency graphs, so there is no shared module between them yet. Keep
// this in sync by hand until the dummy data is replaced with a real
// Perplexity call, at which point this duplication goes away entirely.
function buildDummyAiReview(organizationName: string) {
  return {
    recommendation: "Conditional Go",
    total_score: 8,
    executive_summary: `${organizationName} is a mission-aligned, moderately resourced organization with a clear project ask. Proceed on the condition that scope and timeline are locked down in writing before kickoff — the RFP language leaves both loosely defined.`,
    org_intelligence: [
      { signal: "990 on file?", finding: "Yes — most recent filing available", implication: "Some payment and budget visibility; not a 990-N filer" },
      { signal: "Annual revenue (most recent 990)", finding: "$2.1M (illustrative)", implication: "Mid-size nonprofit — scope should match this budget tier" },
      { signal: "Number of paid employees", finding: "12 (illustrative)", implication: "Small staff — decision-making may be slower than a larger org" },
      { signal: "Point of contact: paid or volunteer?", finding: "Paid, Development Director (illustrative)", implication: "Likely has authority to approve and pay, but confirm budget sign-off chain" },
      { signal: "LinkedIn presence", finding: "Active, regular posting", implication: "Some communications investment already in place" },
      { signal: "Website currency", finding: "Current, updated within the last year", implication: "Reasonable baseline — this isn't a from-scratch rebuild" },
      { signal: "Candid/GuideStar rating", finding: "Gold (illustrative)", implication: "Moderate transparency and accountability culture" },
      { signal: "Recent news or notable events", finding: "No major coverage found (illustrative)", implication: "No obvious reputational red flags" },
    ],
    rubric: [
      { dimension: "Mission Alignment", score: 3, rationale: "Strong fit with Fieldtrip's nonprofit/public-health client segment." },
      { dimension: "Budget & Value Health", score: 2, rationale: "Budget not clearly stated in the RFP — needs a clarification question before proposal." },
      { dimension: "Scope & Boundaries", score: 1, rationale: "Deliverables list reads as open-ended; risk of scope creep without a defined page/asset limit." },
      { dimension: "Timeline & Capacity", score: 2, rationale: "Timeline is workable but tight relative to Fieldtrip's standard delivery cadence." },
    ],
    risks: [
      {
        risk: 'The "Do Everything" Trap — scope language suggests the client may expect broad strategic and organizational input beyond the stated deliverables.',
        guardrail: "Propose a fixed deliverables list with an explicit change-order process for anything outside it.",
      },
      {
        risk: 'The "Compressed Timeline" Trap — the stated deadline is shorter than Fieldtrip\'s standard delivery window for this project type.',
        guardrail: "Propose the standard timeline in the response; be prepared to walk away rather than compress it.",
      },
    ],
    next_steps: [
      "Draft a clarification question confirming the stated or expected budget range.",
      "Confirm the point of contact's authority to approve scope and release payment.",
      "Schedule an internal go/no-go alignment call before sending a proposal.",
    ],
  };
}

async function runScoring(
  supabaseUrl: string,
  authHeader: string,
  rfpId: string,
  organizationName: string,
) {
  const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });

  // Simulated processing delay — stands in for the real Drive fetch + PDF
  // extraction + Perplexity call this will become.
  await new Promise((resolve) => setTimeout(resolve, 2500));

  await supabase
    .from("rfps")
    .update({
      ai_review_status: "completed",
      ai_review_result: buildDummyAiReview(organizationName),
      ai_review_scored_at: new Date().toISOString(),
    })
    .eq("id", rfpId);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { rfp_id: rfpId } = await req.json();
  if (!rfpId) {
    return new Response(JSON.stringify({ error: "rfp_id is required" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: rfp, error: fetchError } = await supabase
    .from("rfps")
    .select("id, organization_name, document_drive_url")
    .eq("id", rfpId)
    .single();

  if (fetchError || !rfp) {
    return new Response(JSON.stringify({ error: "RFP not found" }), {
      status: 404,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (!rfp.document_drive_url) {
    return new Response(JSON.stringify({ error: "No document attached" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { error: updateError } = await supabase
    .from("rfps")
    .update({ ai_review_status: "scoring" })
    .eq("id", rfpId);

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Respond immediately; keep working after the response goes out so the
  // client isn't left holding a long-running HTTP request open.
  // @ts-expect-error EdgeRuntime is a Supabase-provided global at runtime
  EdgeRuntime.waitUntil(runScoring(supabaseUrl, authHeader, rfpId, rfp.organization_name));

  return new Response(JSON.stringify({ status: "scoring" }), {
    status: 202,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
